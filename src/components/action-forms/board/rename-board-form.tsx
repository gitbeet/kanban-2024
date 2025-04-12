"use client";

import { useRef, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { handleRenameBoard } from "~/server/queries";
import InputField from "~/components/ui/input-field";
import { BoardSchema } from "~/zod-schemas";
import type { ChangeEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { type RenameBoardAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import EditButton from "~/components/ui/button/edit-button";

const RenameBoardForm = ({ boardId }: { boardId: string }) => {
  const [newBoardName, setNewBoardName] = useState("");
  const [error, setError] = useState("");
  const renameBoardRef = useRef<HTMLFormElement>(null);
  const { setOptimisticBoards } = useBoards();
  const [pending, startTransition] = useTransition();
  const { user } = useUser();
  const clientAction = async () => {
    if (!user?.id) return;
    renameBoardRef.current?.reset();

    const result = BoardSchema.pick({ id: true, name: true }).safeParse({
      id: boardId,
      name: newBoardName,
    });
    if (!result.success) {
      return setError(result.error.issues[0]?.message ?? "An error occured");
    }

    const action: RenameBoardAction = {
      type: "RENAME_BOARD",
      payload: {
        boardId,
        newBoardName,
      },
    };

    startTransition(() => setOptimisticBoards(action));

    const response = await handleRenameBoard({
      action,
    });
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
    }
  };

  const handleBoardNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setNewBoardName(e.target.value);
  };

  return (
    <form ref={renameBoardRef} action={clientAction} className="flex">
      <input type="hidden" name="board-id" value={boardId} />
      <InputField
        value={newBoardName}
        onChange={handleBoardNameChange}
        type="text"
        name="board-name-input"
        placeholder="Board name..."
        error={error}
        handleCancel={() => console.log("Clicked outside")}
        handleSubmit={clientAction}
        shiftLayout
      />

      <EditButton />
    </form>
  );
};

export default RenameBoardForm;
