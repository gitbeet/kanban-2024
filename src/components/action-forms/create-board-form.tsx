"use client";

import React, { useRef, useState } from "react";
import SubmitButton from "../ui/submit-button";
import type { BoardType, SetOptimisticType } from "~/types";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";
import { createBoardAction } from "~/actions";
import { BoardSchema } from "~/zod-schemas";

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

  const clientAction = async (formData: FormData) => {
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

  return (
    <form ref={createBoardRef} action={clientAction} className="flex">
      <div>
        <input
          value={boardName}
          onChange={(e) => {
            setError("");
            setBoardName(e.target.value);
          }}
          type="text"
          name="board-name-input"
          className={`${error ? "border-red-600" : ""} border-2 text-black`}
          placeholder="Create board..."
        />
        <p className="text-red-500">{error}</p>
      </div>

      <SubmitButton text="Create board" />
    </form>
  );
};

export default CreateBoardActionForm;
