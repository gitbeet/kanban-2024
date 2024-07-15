"use client";

import Board from "./board";
import SelectBoard from "./select-board";
import CreateBoardForm from "./action-forms/board/create-board-form";

const Boards = () => {
  return (
    <div className="w-full">
      <section className="flex items-center gap-4 border-b py-2">
        <SelectBoard />
        <CreateBoardForm />
      </section>
      <div className="h-16"></div>
      <Board />
    </div>
  );
};

export default Boards;
