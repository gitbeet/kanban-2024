import React from "react";
import { type BoardType } from "../types";
import Column from "../components/column";
const Board = ({ board }: { board: BoardType }) => {
  return (
    <div>
      <h2 className="pb-4 text-xl">{board.name}</h2>
      <div className="flex gap-16">
        {board.columns.map((col) => (
          <Column key={col.id} column={col} />
        ))}
      </div>
    </div>
  );
};

export default Board;
