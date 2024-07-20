"use client";

import React from "react";
import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import CreateBoardForm from "./action-forms/board/create-board-form";
import DeleteBoardForm from "./action-forms/board/delete-board-form";

const Sidebar = () => {
  const { showSidebar, setShowSidebar } = useUI();
  const { optimisticBoards, setCurrentBoardId, currentBoardId } = useBoards();
  return (
    <motion.section
      layout
      className={`relative z-10 ${showSidebar ? "ml-0 translate-x-0" : "-mr-64 -translate-x-64"} w-64 shrink-0 border-r transition-all duration-300`}
    >
      <div className="h-8"></div>
      <h2 className="pl-4 text-xl font-medium">
        All boards ({optimisticBoards.length})
      </h2>
      <div className="h-16"></div>
      <motion.ul>
        {optimisticBoards
          .sort((a, b) => a.index - b.index)
          .map((board) => (
            <motion.li
              onClick={() => setCurrentBoardId(board.id)}
              layout
              key={board.index}
              className={`group cursor-pointer pr-4`}
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className={`w-full truncate px-4 py-3 ${board.id === currentBoardId ? "rounded-r-full bg-white text-black" : ""}`}
                >
                  {board.name}
                </span>
                <DeleteBoardForm
                  // className="opacity-0 group-hover:opacity-100"
                  boardId={board.id}
                  boardIndex={board.index}
                />
              </div>
            </motion.li>
          ))}
        <motion.li layout className="px-4">
          <div className="h-4"></div>

          <CreateBoardForm />
        </motion.li>
      </motion.ul>
      <div className="h-16"></div>

      <p className="pl-4">Dark mode button</p>
      <p
        onClick={() =>
          showSidebar ? setShowSidebar(false) : setShowSidebar(true)
        }
        className="absolute bottom-12 right-0 translate-x-full rounded rounded-r-full border bg-white px-4 py-3 text-xl text-neutral-800"
      >
        {showSidebar ? <FaEyeSlash /> : <FaEye />}
      </p>
    </motion.section>
  );
};

export default Sidebar;
