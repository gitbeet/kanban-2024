import React from "react";
import { type BoardType } from "../types";
import Board from "./board";

const Boards = ({ boards }: { boards: BoardType[] }) => {
  return (
    <section className="flex gap-32">
      {boards.map((board) => (
        <Board board={board} key={board.id} />
      ))}
    </section>
  );
};

export default Boards;
