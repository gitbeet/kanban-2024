"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { useBoards } from "~/context/boards-context";
import { handleCreateBoard } from "~/server/queries";
import { v4 as uuid } from "uuid";
import InputField from "~/components/ui/input-field";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import {
  AddButton,
  Button,
  CancelButton,
  SaveButton,
} from "~/components/ui/button/buttons";
import { BoardSchema } from "~/zod-schemas";
import type { ChangeEvent, FormEvent } from "react";
import type { BoardType } from "~/types";
import FocusTrap from "focus-trap-react";
import { type CreateBoardAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import {
  slideButtonsRightVariants,
  slideFormDownVariants,
  smallElementTransition,
} from "~/utilities/framer-motion";
import Text from "~/components/ui/typography/text";

const CreateBoardForm = ({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const createBoardRef = useRef<HTMLFormElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const { user } = useUser();
  const { optimisticBoards, setOptimisticBoards, setBoardsLoading } =
    useBoards();

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

    const maxIndex = optimisticBoards.length;

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

    console.log(action);

    startTransition(() => {
      setOptimisticBoards(action);
    });
    // Server error check
    const response = await handleCreateBoard({
      action,
    });
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
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
          <motion.div
            layout
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 1,
            }}
            className={props.className}
          >
            <AddButton text="Add a board" onClick={() => setIsOpen(true)} />
          </motion.div>
        )}

        {isOpen && (
          <div>
            <motion.form
              variants={slideFormDownVariants}
              initial="initial"
              animate="animate"
              transition={smallElementTransition}
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
                errorPlacement="bottomRight"
                shiftLayout={false}
              />
              <motion.div
                layout
                variants={slideButtonsRightVariants}
                initial="initial"
                animate="animate"
                transition={{ ...smallElementTransition, delay: 0.1 }}
                className={`flex items-center justify-end gap-1.5`}
              >
                <SaveButton
                  disabled={!!error || loading}
                  aria-label="Add board"
                />
                <CancelButton
                  onClick={handleClickOutside}
                  aria-label="Close menu"
                />
              </motion.div>
            </motion.form>
          </div>
        )}
      </div>
    </FocusTrap>
  );
};

export default CreateBoardForm;
