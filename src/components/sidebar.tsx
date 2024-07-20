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
  const { optimisticBoards, setCurrentBoardId } = useBoards();
  return (
    <motion.section
      layout
      className={`relative z-10 p-4 ${showSidebar ? "ml-0 translate-x-0" : "-mr-64 -translate-x-64"} w-64 shrink-0 border-r transition-all duration-300`}
    >
      <div className="h-12"></div>
      <h2 className="text-xl font-medium">
        All boards ({optimisticBoards.length})
      </h2>
      <div className="h-16"></div>
      <motion.ul>
        {optimisticBoards
          .sort((a, b) => a.index - b.index)
          .map((board) => (
            <motion.li layout key={board.index}>
              <div className="h-8"></div>
              <div className="flex justify-between">
                <p onClick={() => setCurrentBoardId(board.id)} key={board.id}>
                  {board.name}
                </p>
                <DeleteBoardForm boardId={board.id} boardIndex={board.index} />
              </div>
            </motion.li>
          ))}
        <motion.li layout>
          <div className="h-8"></div>

          <CreateBoardForm />
        </motion.li>
      </motion.ul>
      <div className="h-16"></div>

      <p>Dark mode button</p>
      <p
        onClick={() =>
          showSidebar ? setShowSidebar(false) : setShowSidebar(true)
        }
        className="absolute bottom-12 right-0 translate-x-full rounded border bg-neutral-800 px-4 py-3"
      >
        {showSidebar ? <FaEyeSlash /> : <FaEye />}
      </p>
    </motion.section>
  );
};

export default Sidebar;
