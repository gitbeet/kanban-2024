"use client";

import React from "react";
import { useBoards } from "~/context/boards-context";

const Sidebar = () => {
  const { optimisticBoards, setCurrentBoardId } = useBoards();
  return (
    <section className="w-64 shrink-0 border-r">
      <div className="h-12"></div>
      <h2 className="text-xl font-medium">
        All boards ({optimisticBoards.length})
      </h2>
      <div className="h-16"></div>
      <ul>
        {optimisticBoards.map((board) => (
          <li key={board.index}>
            <div className="h-8"></div>
            <p onClick={() => setCurrentBoardId(board.id)} key={board.id}>
              {board.name}
            </p>
          </li>
        ))}
      </ul>
      <div className="h-16"></div>

      <p>Dark mode button</p>
      <p>Hide sidebar</p>
    </section>
  );
};

export default Sidebar;
