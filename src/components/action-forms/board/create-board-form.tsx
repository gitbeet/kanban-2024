"use client";

import React, { type ChangeEvent, useRef, useState } from "react";
import type { BoardType } from "~/types";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";
import { createBoardAction } from "~/actions";
import { BoardSchema } from "~/zod-schemas";
import { CreateButton } from "~/components/ui/buttons";
import InputField from "~/components/ui/input-field";
import { useBoards } from "~/context/boards-context";

const CreateBoardForm = () => {
  const createBoardRef = useRef<HTMLFormElement>(null);
  const { user } = useUser();
  const { optimisticBoards, setOptimisticBoards } = useBoards();

  const [boardName, setBoardName] = useState("");
  const [error, setError] = useState("");

  const clientAction = async () => {
    if (!user?.id) return;
    const maxIndex = Math.max(...optimisticBoards.map((b) => b.index));
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
    setOptimisticBoards({ action: "createBoard", board: newBoard });

    // Server error check
    const response = await createBoardAction(boardName);
    if (response?.error) {
      setError(response.error);
    }
  };

  const handleBoardName = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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

export default CreateBoardForm;
