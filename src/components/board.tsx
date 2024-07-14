"use client";

import React from "react";
import type { BoardType, SetOptimisticType } from "../types";
import Column from "../components/column";
import { useUser } from "@clerk/nextjs";
import DeleteTaskZone from "./delete-task-zone";
import RenameBoardForm from "./action-forms/board/rename-board-form";
import DeleteBoardForm from "./action-forms/board/delete-board-form";
import CreateColumnForm from "./action-forms/column/create-column-form";
const Board = ({
  board,
  setOptimistic,
}: {
  board: BoardType;
  setOptimistic: SetOptimisticType;
}) => {
  const { user } = useUser();

  if (!user?.id) return <h1>Please log in (placeholder error)</h1>;

  return (
    <section className="overflow-x-scroll">
      <div className="flex items-start gap-4">
        <h2 className="pb-4 text-xl">{board.name}</h2>
        <RenameBoardForm board={board} setOptimistic={setOptimistic} />
        <DeleteBoardForm board={board} setOptimistic={setOptimistic} />
        <CreateColumnForm board={board} setOptimistic={setOptimistic} />
      </div>
      <div className="shrink-0">
        <h2 className="pb-4 text-xl font-bold">Columns</h2>
        <div className="flex gap-4">
          {board.columns.map((col) => (
            <Column
              key={col.index}
              board={board}
              column={col}
              setOptimistic={setOptimistic}
            />
          ))}
          <DeleteTaskZone setOptimistic={setOptimistic} board={board} />
        </div>
      </div>
    </section>
  );
};

export default Board;
