"use client";

import { type ChangeEvent, useRef, useState } from "react";
import { renameBoardAction } from "~/actions";
import InputField from "~/components/ui/input-field";
import SubmitButton from "~/components/ui/submit-button";
import type { BoardType, SetOptimisticType } from "~/types";
import { BoardSchema } from "~/zod-schemas";

const RenameBoardForm = ({
  board,
  setOptimistic,
}: {
  board: BoardType;
  setOptimistic: SetOptimisticType;
}) => {
  const [newBoardName, setNewBoardName] = useState("");
  const [error, setError] = useState("");
  const renameBoardRef = useRef<HTMLFormElement>(null);

  const clientAction = async (formData: FormData) => {
    renameBoardRef.current?.reset();
    const name = formData.get("board-name-input") as string;
    const renamedBoard: BoardType = {
      ...board,
      name,
      updatedAt: new Date(),
    };

    // Client error check
    const result = BoardSchema.safeParse(renamedBoard);
    if (!result.success) {
      return setError(result.error.issues[0]?.message ?? "An error occured");
    }

    setOptimistic({ action: "renameBoard", board: renamedBoard });

    // Server error check

    const response = await renameBoardAction(renamedBoard);
    if (response?.error) {
      return setError(response.error);
    }
  };

  const handleBoardNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setNewBoardName(e.target.value);
  };

  return (
    <form ref={renameBoardRef} action={clientAction}>
      <input type="hidden" name="board-id" value={board.id} />
      <InputField
        value={newBoardName}
        onChange={handleBoardNameChange}
        type="text"
        name="board-name-input"
        placeholder="Board name..."
        error={error}
      />

      <SubmitButton text="Rename board" pendingText="Renaming board..." />
    </form>
  );
};

export default RenameBoardForm;
