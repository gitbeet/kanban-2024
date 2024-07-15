"use client";

import React, { type FormEvent, useState } from "react";
import Board from "./board";
import { useUser } from "@clerk/nextjs";
import SelectBoard from "./select-board";
import CreateBoardActionForm from "./action-forms/board/create-board-form";
import { useBoards } from "~/context/boards-context";

const Boards = () => {
  const { user } = useUser();

  const { optimisticBoards } = useBoards();

  const [currentBoardId, setCurrentBoardId] = useState<string | null>(
    optimisticBoards?.[0]?.id ?? null,
  );

  const currentBoard = optimisticBoards.find(
    (board) => board.id === currentBoardId,
  );

  const handleBoardChange = (e: FormEvent<HTMLSelectElement>) => {
    setCurrentBoardId(e.currentTarget.value);
  };

  if (!user?.id) return <h1>please log in (placeholder error message)</h1>;
  return (
    <div className="w-full">
      <section className="flex items-center gap-4 border-b py-2">
        <SelectBoard onChange={handleBoardChange} />
        <CreateBoardActionForm />
      </section>
      <div className="h-16"></div>
      <section>
        {currentBoard && (
          <Board board={currentBoard} key={currentBoard.index} />
        )}
      </section>
    </div>
  );
};

export default Boards;
