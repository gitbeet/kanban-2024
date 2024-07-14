"use client";

import React, { type FormEvent, useOptimistic, useState } from "react";
import type { BoardType } from "../types";
import Board from "./board";
import { useUser } from "@clerk/nextjs";
import SelectBoard from "./select-board";
import { handleOptimisticUpdate } from "~/optimisticHandlers";
import CreateBoardActionForm from "./action-forms/board/create-board-form";

const Boards = ({ boards }: { boards: BoardType[] }) => {
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
    <div className="w-full">
      <section className="flex items-center gap-4 border-b py-2">
        <SelectBoard boards={selectBoards} onChange={handleBoardChange} />
        <CreateBoardActionForm
          boards={boards}
          setOptimistic={setOptimisticBoards}
        />
      </section>
      <div className="h-16"></div>
      <section>
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
