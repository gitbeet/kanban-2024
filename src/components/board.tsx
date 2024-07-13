"use client";

import React, { useRef } from "react";
import type { ColumnType, BoardType, SetOptimisticType } from "../types";
import Column from "../components/column";
import SubmitButton from "./ui/submit-button";
import {
  createColumnAction,
  deleteBoardAction,
  renameBoardAction,
} from "~/actions";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";
import DeleteTaskZone from "./delete-task-zone";
const Board = ({
  board,
  setOptimistic,
}: {
  board: BoardType;
  setOptimistic: SetOptimisticType;
}) => {
  const { user } = useUser();
  const renameBoardRef = useRef<HTMLFormElement>(null);
  const createColumnRef = useRef<HTMLFormElement>(null);

  if (!user?.id) return <h1>Please log in (placeholder error)</h1>;

  const renameBoardActionForm = (
    <form
      ref={renameBoardRef}
      action={async (formData: FormData) => {
        renameBoardRef.current?.reset();
        const name = formData.get("board-name-input") as string;
        const renamedBoard: BoardType = {
          ...board,
          name,
          updatedAt: new Date(),
        };
        setOptimistic({ action: "renameBoard", board: renamedBoard });
        await renameBoardAction(formData);
      }}
    >
      <input type="hidden" name="board-id" value={board.id} />
      <input type="text" name="board-name-input" placeholder="Board name..." />
      <SubmitButton text="Rename board" pendingText="Renaming board..." />
    </form>
  );
  const deleteBoardActionForm = (
    <form
      action={async (formData: FormData) => {
        setOptimistic({ action: "deleteBoard", board });
        await deleteBoardAction(formData);
      }}
    >
      <input type="hidden" name="board-id" value={board.id} />
      <SubmitButton text="Delete board" pendingText="Deleting board..." />
    </form>
  );

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
        {renameBoardActionForm}
        {deleteBoardActionForm}
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
