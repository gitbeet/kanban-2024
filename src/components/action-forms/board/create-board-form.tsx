"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { useBoards } from "~/context/boards-context";
import { handleCreateBoard } from "~/server/queries";
import { v4 as uuid } from "uuid";
import InputField from "~/components/ui/input-field";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { Button, SaveButton } from "~/components/ui/button/buttons";
import { BoardSchema } from "~/zod-schemas";
import type { ChangeEvent, FormEvent } from "react";
import type { BoardType } from "~/types";
import FocusTrap from "focus-trap-react";
import { type CreateBoardAction } from "~/types/actions";

const CreateBoardForm = ({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const createBoardRef = useRef<HTMLFormElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const { user } = useUser();
  const {
    optimisticBoards,
    setOptimisticBoards,
    setLoading: setBoardsLoading,
  } = useBoards();

  const [boardName, setBoardName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setBoardsLoading((prev) => ({ ...prev, createBoard: pending }));
  }, [pending, setBoardsLoading]);

  const clientAction = async (e?: FormEvent) => {
    // optimistically close the form
    setIsOpen(false);

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

    // Client error check
    const boardNameAlreadyExists =
      optimisticBoards.findIndex(
        (board) =>
          board.name.toLowerCase().trim() ===
          newBoard.name.toLowerCase().trim(),
      ) !== -1;
    if (boardNameAlreadyExists) {
      setError("Already exists");
      setLoading(false);
      setIsOpen(true);
      inputFieldRef.current?.focus();
      return;
    }

    const result = BoardSchema.safeParse(newBoard);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      setLoading(false);
      setIsOpen(true);
      inputFieldRef.current?.focus();
      return;
    }

    const action: CreateBoardAction = {
      type: "CREATE_BOARD",
      payload: { board: newBoard },
    };

    startTransition(() => {
      setOptimisticBoards(action);
    });
    // Server error check
    const response = await handleCreateBoard({
      action,
      revalidate: true,
    });
    if (response?.error) {
      setError(response.error);
      setIsOpen(true);
      setLoading(false);
      return;
    }

    setError("");
    setBoardName("");
    setLoading(false);
  };

  const handleChangeBoardName = (
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
    <FocusTrap
      active={isOpen}
      focusTrapOptions={{
        escapeDeactivates: true,
        allowOutsideClick: true,
        onDeactivate: handleClickOutside,
        clickOutsideDeactivates: true,
      }}
    >
      <div>
        {!isOpen && (
          <motion.div layout className={props.className}>
            <Button
              variant="text"
              onClick={() => setIsOpen(true)}
              tabIndex={props.tabIndex}
              aria-label="Add a new board"
            >
              <div className="text-secondary--hoverable flex items-center gap-2 text-sm">
                <FaPlus className="h-3 w-3" />
                <span>Add a board</span>
              </div>
            </Button>
          </motion.div>
        )}

        {isOpen && (
          <div>
            <form
              ref={createBoardRef}
              onSubmit={clientAction}
              className="flex items-center gap-2"
            >
              <InputField
                ref={inputFieldRef}
                autoFocus
                aria-label="Enter board name"
                type="text"
                error={error}
                placeholder="Create board..."
                value={boardName}
                className="w-full"
                onChange={handleChangeBoardName}
                errorPlacement="bottom"
                handleSubmit={clientAction}
                handleCancel={handleClickOutside}
              />

              <SaveButton
                disabled={!!error || loading}
                className="relative -top-2.5"
                aria-label="Add board"
              />
            </form>
          </div>
        )}
      </div>
    </FocusTrap>
  );
};

export default CreateBoardForm;
