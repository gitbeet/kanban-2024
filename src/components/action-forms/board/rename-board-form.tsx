"use client";

import { type ChangeEvent, useRef, useState } from "react";
import { renameBoardAction } from "~/actions";
import InputField from "~/components/ui/input-field";
import { EditButton } from "~/components/ui/submit-button";
import { useBoards } from "~/context/boards-context";
import { BoardSchema } from "~/zod-schemas";

const RenameBoardForm = ({ boardId }: { boardId: string }) => {
  const [newBoardName, setNewBoardName] = useState("");
  const [error, setError] = useState("");
  const renameBoardRef = useRef<HTMLFormElement>(null);
  const { setOptimisticBoards } = useBoards();

  const clientAction = async () => {
    renameBoardRef.current?.reset();

    const result = BoardSchema.pick({ id: true, name: true }).safeParse({
      id: boardId,
      name: newBoardName,
    });
    if (!result.success) {
      return setError(result.error.issues[0]?.message ?? "An error occured");
    }

    setOptimisticBoards({
      action: "renameBoard",
      boardId: boardId,
      newBoardName,
    });

    const response = await renameBoardAction(boardId, newBoardName);
    if (response?.error) {
      return setError(response.error);
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
      />

      <EditButton />
    </form>
  );
};

export default RenameBoardForm;
