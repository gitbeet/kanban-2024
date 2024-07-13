"use client";

import React, { type FormEvent, useOptimistic, useRef, useState } from "react";
import type { BoardType } from "../types";
import Board from "./board";
import SubmitButton from "./ui/submit-button";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";
import { createBoardAction } from "~/actions";
import SelectBoard from "./select-board";
import { handleOptimisticUpdate } from "~/optimisticHandlers";

const Boards = ({ boards }: { boards: BoardType[] }) => {
  const createBoardRef = useRef<HTMLFormElement>(null);

  const { user } = useUser();

  const [optimisticBoards, setOptimisticBoards] = useOptimistic(
    boards,
    handleOptimisticUpdate,
  );

  const [currentBoardId, setCurrentBoardId] = useState<string | null>(
    optimisticBoards?.[0]?.id ?? null,
  );

  const currentBoard = optimisticBoards.find(
    (board) => board.id === currentBoardId,
  );

  const selectBoards = optimisticBoards.map(({ id, name }) => ({ id, name }));

  const handleBoardChange = (e: FormEvent<HTMLSelectElement>) => {
    setCurrentBoardId(e.currentTarget.value);
  };

  if (!user?.id) return <h1>please log in (placeholder error message)</h1>;

  return (
    <div className="space-y-16">
      <section className="flex items-center gap-4">
        <SelectBoard boards={selectBoards} onChange={handleBoardChange} />
        <form
          ref={createBoardRef}
          action={async (formData: FormData) => {
            const maxIndex = Math.max(...boards.map((b) => b.index));
            createBoardRef.current?.reset();
            const name = formData.get("board-name-input") as string;
            const newBoard: BoardType = {
              id: uuid(),
              index: maxIndex + 1,
              name,
              columns: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              userId: user?.id,
            };
            setOptimisticBoards({ action: "createBoard", board: newBoard });
            await createBoardAction(formData);
          }}
        >
          <input
            type="text"
            name="board-name-input"
            className="text-black"
            placeholder="Create board..."
          />
          <SubmitButton text="Create board" />
        </form>
      </section>
      <section className="flex gap-32">
        {currentBoard && (
          <Board
            board={currentBoard}
            key={currentBoard.index}
            setOptimistic={setOptimisticBoards}
          />
        )}
      </section>
    </div>
  );
};

export default Boards;
