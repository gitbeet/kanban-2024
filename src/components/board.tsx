"use client";

import React, { useRef } from "react";
import type { ColumnType, BoardType, SetOptimisticType } from "../types";
import Column from "../components/column";
import SubmitButton from "./ui/submit-button";
import { createColumnAction, deleteBoardAction } from "~/actions";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";
import DeleteTaskZone from "./delete-task-zone";
import RenameBoardForm from "./action-forms/board/rename-board-form";
import DeleteBoardForm from "./action-forms/board/delete-board-form";
const Board = ({
  board,
  setOptimistic,
}: {
  board: BoardType;
  setOptimistic: SetOptimisticType;
}) => {
  const { user } = useUser();
  const createColumnRef = useRef<HTMLFormElement>(null);

  if (!user?.id) return <h1>Please log in (placeholder error)</h1>;

  const createColumnActionForm = (
    <form
      ref={createColumnRef}
      action={async (formData: FormData) => {
        const maxIndex = Math.max(...board.columns.map((c) => c.index));
        createColumnRef.current?.reset();
        const name = formData.get("column-name-input") as string;
        const newColumn: ColumnType = {
          id: uuid(),
          index: maxIndex + 1,
          boardId: board.id,
          name,
          tasks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setOptimistic({ action: "createColumn", board, column: newColumn });
        await createColumnAction(formData);
      }}
    >
      <input type="hidden" name="board-id" value={board.id} />
      <input
        type="text"
        name="column-name-input"
        className="text-black"
        placeholder="Create column..."
      />
      <SubmitButton text="Create column" />
    </form>
  );
  return (
    <div>
      <div className="flex items-start gap-4">
        <h2 className="pb-4 text-xl">{board.name}</h2>
        <RenameBoardForm board={board} setOptimistic={setOptimistic} />;
        <DeleteBoardForm board={board} setOptimistic={setOptimistic} />
        {createColumnActionForm}
      </div>
      <div>
        <h2 className="pb-4 text-xl font-bold">Columns</h2>
        <div className="flex items-start">
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
    </div>
  );
};

export default Board;
