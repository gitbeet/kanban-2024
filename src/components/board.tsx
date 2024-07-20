"use client";

import React from "react";
import Column from "../components/column";
import DeleteTaskZone from "./delete-task-zone";
import CreateColumnForm from "./action-forms/column/create-column-form";
import { motion } from "framer-motion";
import { useBoards } from "~/context/boards-context";
import CreateBoardForm from "./action-forms/board/create-board-form";
import { LoadingPage } from "./ui/loading-spinner";

const Board = () => {
  const { optimisticBoards, currentBoardId, loading, getCurrentBoard } =
    useBoards();
  const currentBoard = getCurrentBoard();
  if (loading.deleteBoard) return <LoadingPage />;

  const noBoards = !optimisticBoards.length;

  const noBoardsJsx = (
    <section className="grid w-full place-content-center gap-4">
      <h1 className="w-full text-center text-3xl font-bold">
        You have no boards
      </h1>
      <CreateBoardForm className="text-center" />
    </section>
  );

  if (noBoards) return noBoardsJsx;

  const emptyBoardJsx = (
    <section className="grid w-full place-content-center">
      <h1 className="w-full text-center text-3xl font-bold">
        This board is empty
      </h1>
      <CreateColumnForm boardId={currentBoardId} className="!bg-transparent" />
    </section>
  );

  const boardJsx = (
    <motion.section
      layout
      key={currentBoardId}
      className="grid grow grid-rows-[1fr,auto] overflow-auto"
    >
      {/* key prop for framer-motion */}
      <motion.div className="flex gap-4 p-8">
        {currentBoard?.columns
          .sort((a, b) => a.index - b.index)
          .map((col) => (
            <Column key={col.index} boardId={currentBoardId} column={col} />
          ))}

        <motion.div layout className="h-96">
          <CreateColumnForm boardId={currentBoardId} />
          <div className="h-4" />
          <DeleteTaskZone />
        </motion.div>
      </motion.div>
    </motion.section>
  );

  const isBoardEmpty = currentBoard?.columns.length === 0;

  return isBoardEmpty ? emptyBoardJsx : boardJsx;
};

export default Board;
