"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import type { BoardType, SetOptimisticType } from "~/types";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";
import { createBoardAction } from "~/actions";
import { BoardSchema } from "~/zod-schemas";
import { CreateButton } from "~/components/ui/submit-button";
import InputField from "~/components/ui/input-field";

const CreateBoardActionForm = ({
  boards,
  setOptimistic,
}: {
  boards: BoardType[];
  setOptimistic: SetOptimisticType;
}) => {
  const createBoardRef = useRef<HTMLFormElement>(null);
  const { user } = useUser();

  const [boardName, setBoardName] = useState("");
  const [error, setError] = useState("");

  const clientAction = async () => {
    if (!user?.id) return;
    const maxIndex = Math.max(...boards.map((b) => b.index));
    createBoardRef.current?.reset();
    const newBoard: BoardType = {
      id: uuid(),
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
    setOptimistic({ action: "createBoard", board: newBoard });

    // Server error check
    const response = await createBoardAction(boardName);
    if (response?.error) {
      setError(response.error);
    }
  };

  const handleBoardName = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setBoardName(e.target.value);
  };

  return (
    <form
      ref={createBoardRef}
      action={clientAction}
      className="flex items-center gap-2"
    >
      <InputField
        name="board-name-input"
        type="text"
        error={error}
        placeholder="Create board..."
        value={boardName}
        onChange={handleBoardName}
      />

      <CreateButton />
    </form>
  );
};

export default CreateBoardActionForm;
