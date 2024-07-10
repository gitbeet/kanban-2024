"use client";

import React, { useOptimistic, useRef } from "react";
import { type ColumnType, type BoardType } from "../types";
import Column from "../components/column";
import SubmitButton from "./ui/submit-button";
import {
  createColumnAction,
  deleteBoardAction,
  renameBoardAction,
} from "~/actions";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";
const Board = ({
  board,
  setOptimistic,
}: {
  board: BoardType;
  setOptimistic: (action: {
    action: "create" | "rename" | "delete";
    board: BoardType;
  }) => void;
}) => {
  const { user } = useUser();
  const renameBoardRef = useRef<HTMLFormElement>(null);
  const createColumnRef = useRef<HTMLFormElement>(null);
  const [optimisticColumns, setOptimisticColumns] = useOptimistic(
    board.columns,
    (
      state,
      {
        action,
        column,
      }: { action: "create" | "rename" | "delete"; column: ColumnType },
    ) => {
      if (action === "create") return [...state, column];
      if (action === "rename")
        return state.map((col) => (col.id === column.id ? column : col));
      if (action === "delete")
        return state.filter((col) => col.id !== column.id);
      return state;
    },
  );

  if (!user?.id) return <h1>Please log in (placeholder error)</h1>;

  return (
    <div>
      <h2 className="pb-4 text-xl">{board.name}</h2>
      {/* Rename board action */}
      <form
        ref={renameBoardRef}
        action={async (formData: FormData) => {
          renameBoardRef.current?.reset();
          const name = formData.get("board-name-input") as string;
          const renamedBoard: BoardType = {
            ...board,
            name,
          };
          setOptimistic({ action: "rename", board: renamedBoard });
          await renameBoardAction(formData);
        }}
      >
        <input type="hidden" name="board-id" value={board.id} />
        <input
          type="text"
          name="board-name-input"
          placeholder="Board name..."
        />
        <SubmitButton text="Rename board" pendingText="Renaming board..." />
      </form>
      {/* Delete board action */}
      <form
        action={async (formData: FormData) => {
          setOptimistic({ action: "delete", board });
          await deleteBoardAction(formData);
        }}
      >
        <input type="hidden" name="board-id" value={board.id} />
        <SubmitButton text="Delete board" pendingText="Deleting board..." />
      </form>

      {/* ---------- COLUMN ---------- */}
      <form
        ref={createColumnRef}
        action={async (formData: FormData) => {
          createColumnRef.current?.reset();
          const name = formData.get("column-name-input") as string;
          const newColumn: ColumnType = {
            id: uuid(),
            boardId: board.id,
            name,
            tasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setOptimisticColumns({ action: "create", column: newColumn });
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
      <div>
        <h2 className="pb-4 text-xl font-bold">Columns</h2>
        <div className="flex items-start gap-16">
          {optimisticColumns.map((col) => (
            <Column
              key={col.id}
              column={col}
              setOptimistic={setOptimisticColumns}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
