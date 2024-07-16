"use client";

import React from "react";
import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Sidebar = () => {
  const { showSidebar, setShowSidebar } = useUI();
  const { optimisticBoards, setCurrentBoardId } = useBoards();
  return (
    <motion.section
      layout
      className={`relative p-4 ${showSidebar ? "ml-0 translate-x-0" : "-mr-64 -translate-x-64"} w-64 border-r transition-all duration-300`}
    >
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
      {/* <p onClick={() => setShowSidebar(false)}>Hide sidebar</p> */}
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
