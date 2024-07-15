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
    <section className="overflow-x-scroll">
      <div className="flex items-start gap-4">
        <h2 className="pb-4 text-xl">{currentBoard.name}</h2>
        <RenameBoardForm boardId={currentBoardId} />
        <DeleteBoardForm boardId={currentBoardId} />
        <CreateColumnForm boardId={currentBoardId} />
      </div>
      <div className="shrink-0">
        <h2 className="pb-4 text-xl font-bold">Columns</h2>
        <motion.div className="flex gap-4">
          {currentBoard.columns.map((col) => (
            <Column key={col.index} boardId={currentBoardId} column={col} />
          ))}

          <motion.div className="flex gap-4" layout>
            <CreateColumnForm boardId={currentBoardId} jsx="block" />
            <DeleteTaskZone />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Board;
