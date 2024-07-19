"use client";

import React from "react";
import Column from "../components/column";
import { useUser } from "@clerk/nextjs";
import DeleteTaskZone from "./delete-task-zone";
import RenameBoardForm from "./action-forms/board/rename-board-form";
import DeleteBoardForm from "./action-forms/board/delete-board-form";
import CreateColumnForm from "./action-forms/column/create-column-form";
import { motion } from "framer-motion";
import { useBoards } from "~/context/boards-context";

const Board = () => {
  const { user } = useUser();
  const { currentBoardId, optimisticBoards } = useBoards();
  const currentBoard = optimisticBoards.find(
    (board) => board.id === currentBoardId,
  );
  if (!user?.id) return <h1>Please log in (placeholder error)</h1>;
  if (!currentBoard || !currentBoardId)
    return <h1>No current board available (placeholder error)</h1>;
  return (
    // Key prop for framer-motion
    <motion.section
      layout
      key={currentBoardId}
      className="grid flex-1 grow grid-rows-[1fr,100%] overflow-scroll"
    >
      <div className="flex items-center gap-4 border-b">
        <RenameBoardForm boardId={currentBoardId} />
        <DeleteBoardForm boardId={currentBoardId} />
        <CreateColumnForm boardId={currentBoardId} />
      </div>
      <motion.div className="flex gap-4 p-8">
        {currentBoard.columns
          .sort((a, b) => a.index - b.index)
          .map((col) => (
            <Column key={col.index} boardId={currentBoardId} column={col} />
          ))}

        <motion.div className="flex flex-col gap-4" layout>
          <CreateColumnForm boardId={currentBoardId} jsx="block" />
          <DeleteTaskZone />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Board;
