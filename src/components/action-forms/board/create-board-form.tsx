"use client";

import React, {
  type ChangeEvent,
  FormEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import type { BoardType } from "~/types";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";
import { createBoardAction } from "~/actions";
import { BoardSchema } from "~/zod-schemas";
import { Button, CreateButton } from "~/components/ui/buttons";
import InputField from "~/components/ui/input-field";
import { useBoards } from "~/context/boards-context";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import useClickOutside from "~/hooks/useClickOutside";

const CreateBoardForm = () => {
  const createBoardRef = useRef<HTMLFormElement>(null);
  const { user } = useUser();
  const { optimisticBoards, setOptimisticBoards, setCurrentBoardId } =
    useBoards();

  const [boardName, setBoardName] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const { ref } = useClickOutside<HTMLDivElement>(handleClickOutside);

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!user?.id) return;

    const maxIndex = Math.max(...optimisticBoards.map((b) => b.index));
    const newBoardId = uuid();
    const newBoard: BoardType = {
      id: newBoardId,
      index: maxIndex + 1,
      name: boardName,
      columns: [],
      userId: user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Client error check
    const result = BoardSchema.safeParse(newBoard);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      console.log(error);
      return;
    }

    startTransition(() => {
      setOptimisticBoards({ action: "createBoard", board: newBoard });
    });

    // Server error check
    const response = await createBoardAction(boardName, newBoardId);
    if (response?.error) {
      setError(response.error);
    }

    setCurrentBoardId(newBoardId);
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
        <motion.div layout>
          <Button
            variant="text"
            onClick={() => setIsOpen(true)}
            className="-ml-2"
          >
            <div className="flex items-center gap-1">
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
              name="board-name-input"
              type="text"
              error={error}
              placeholder="Create board..."
              value={boardName}
              className="w-full"
              onChange={handleBoardName}
            />

            <CreateButton />
          </form>
        </div>
      )}
    </>
  );
};

export default CreateBoardForm;
