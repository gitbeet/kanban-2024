"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { useBoards } from "~/context/boards-context";
import useClickOutside from "~/hooks/useClickOutside";
import { handleCreateBoard } from "~/server/queries";
import { v4 as uuid } from "uuid";
import InputField from "~/components/ui/input-field";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { Button, SaveButton } from "~/components/ui/button/buttons";
import { BoardSchema } from "~/zod-schemas";
import type { ChangeEvent, FormEvent } from "react";
import type { CreateBoardChange, BoardType } from "~/types";

const CreateBoardForm = ({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const createBoardRef = useRef<HTMLFormElement>(null);
  const { user } = useUser();
  const {
    optimisticBoards,
    setOptimisticBoards,
    setLoading: setBoardsLoading,
    getCurrentBoard,
  } = useBoards();

  const [boardName, setBoardName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setBoardsLoading((prev) => ({ ...prev, createBoard: pending }));
  }, [pending, setBoardsLoading]);

  const { ref } = useClickOutside<HTMLDivElement>(handleClickOutside);

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!user?.id) return;
    setLoading(true);

    const maxIndex = Math.max(...optimisticBoards.map((b) => b.index));
    const newBoardId = uuid();
    const newBoard: BoardType = {
      id: newBoardId,
      current: true,
      index: maxIndex + 1,
      name: boardName,
      columns: [],
      userId: user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setIsOpen(false);

    // Client error check
    const result = BoardSchema.safeParse(newBoard);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      setIsOpen(true);
      return;
    }

    startTransition(() => {
      setOptimisticBoards({ action: "createBoard", board: newBoard });
    });

    // Server error check
    const currentBoardId = getCurrentBoard()?.id;
    const args = {
      change: {
        action: "createBoard",
        oldCurrentBoardId: currentBoardId!,
        id: newBoard.id,
        name: newBoard.name,
      } as CreateBoardChange,
      userId: user.id,
      revalidate: true,
    };
    const response = await handleCreateBoard(args);
    if (response?.error) {
      setError(response.error);
      setIsOpen(true);
      return;
    }

    setError("");
    setBoardName("");
    setLoading(false);
  };

  const handleBoardName = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setBoardName(e.target.value);
  };

  function handleClickOutside() {
    setIsOpen(false);
    setBoardName("");
    setError("");
  }

  return (
    <>
      {!isOpen && (
        <motion.div layout className={props.className}>
          <Button variant="text" onClick={() => setIsOpen(true)}>
            <div className="text-secondary--hoverable flex items-center gap-2">
              <FaPlus className="h-3 w-3" />
              <span>Add a board</span>
            </div>
          </Button>
        </motion.div>
      )}
      {isOpen && (
        <div ref={ref}>
          <form
            ref={createBoardRef}
            onSubmit={clientAction}
            className="flex items-center gap-2"
          >
            <InputField
              autoFocus
              type="text"
              error={error}
              placeholder="Create board..."
              value={boardName}
              className="w-full"
              onChange={handleBoardName}
              errorPlacement="bottom"
              handleSubmit={clientAction}
              handleCancel={handleClickOutside}
            />

            <SaveButton disabled={!!error} className="relative -top-2.5" />
          </form>
        </div>
      )}
    </>
  );
};

export default CreateBoardForm;
