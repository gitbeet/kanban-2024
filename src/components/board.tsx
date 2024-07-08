import React from "react";
import { type BoardType } from "../types";
import Column from "../components/column";
import { createColumn, deleteBoard, renameBoard } from "~/server/queries";
import SubmitButton from "./ui/submit-button";
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
      <form
        action={async (formData: FormData) => {
          "use server";
          const text = formData.get("column-name-input") as string;
          await createColumn(board.id, text);
        }}
      >
        <input type="text" name="column-name-input" className="text-black" />
        <SubmitButton text="Create column" />
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
