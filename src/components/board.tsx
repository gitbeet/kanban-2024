"use client";

import React, { useOptimistic, useRef } from "react";
import { type ColumnType, type BoardType } from "../types";
import Column from "../components/column";
import { createColumn, deleteBoard, renameBoard } from "~/server/queries";
import SubmitButton from "./ui/submit-button";
import { createColumnAction } from "~/actions";
import { v4 as uuid } from "uuid";
const Board = ({ board }: { board: BoardType }) => {
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

  return (
    <div>
      <h2 className="pb-4 text-xl">{board.name}</h2>
      {/* <form
        action={async () => {
          "use server";
          await deleteBoard(board.id);
        }}
      >
        <button type="submit" className="border p-2">
          X
        </button>
      </form>
      <form
        action={async () => {
          "use server";
          await renameBoard(board.id, "Rename test");
        }}
      >
        <button type="submit" className="border p-2">
          Rename to Rename test
        </button>
      </form> */}

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
      <div className="flex gap-16">
        {optimisticColumns.map((col) => (
          <Column
            key={col.id}
            column={col}
            setOptimistic={setOptimisticColumns}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
