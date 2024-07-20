"use client";

import React from "react";
import Column from "../components/column";
import { useUser } from "@clerk/nextjs";
import DeleteTaskZone from "./delete-task-zone";
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
      <motion.div className="flex gap-4 p-8">
        {currentBoard.columns
          .sort((a, b) => a.index - b.index)
          .map((col) => (
            <Column key={col.index} boardId={currentBoardId} column={col} />
          ))}

        <motion.div layout className="h-96">
          <CreateColumnForm boardId={currentBoardId} jsx="block" />
          <div className="h-4" />
          <DeleteTaskZone />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Board;
