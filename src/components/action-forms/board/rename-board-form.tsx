"use client";

import { useRef, useState } from "react";
import { useBoards } from "~/context/boards-context";
import { renameBoardAction } from "~/actions";
import { EditButton } from "~/components/ui/buttons";
import InputField from "~/components/ui/input-field";
import { BoardSchema } from "~/zod-schemas";
import type { ChangeEvent } from "react";

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
    // 7ed3f027-dae1-4d16-90e9-d9bd7ad28593
    // 2024-07-21 06:24:45.035+00
    // 2024-07-21 05:59:49.201+00
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
