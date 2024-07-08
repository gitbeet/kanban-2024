import React from "react";
import { type BoardType } from "../types";
import Column from "../components/column";
import { deleteBoard, renameBoard } from "~/server/queries";
const Board = ({ board }: { board: BoardType }) => {
  return (
    <div>
      <h2 className="pb-4 text-xl">{board.name}</h2>
      <form
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
      </form>
      <div className="flex gap-16">
        {board.columns.map((col) => (
          <Column key={col.id} column={col} />
        ))}
      </div>
    </div>
  );
};

export default Board;
