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
  const { currentBoardId, getCurrentBoard } = useBoards();
  const currentBoard = getCurrentBoard();
  if (!user?.id) return <h1>Please log in (placeholder error)</h1>;
  if (!currentBoard)
    return <h1>No current board id available (placeholder error)</h1>;

  const emptyBoardJsx = (
    <section className="grid w-full place-content-center">
      <h1 className="w-full text-center text-3xl font-bold">
        This board is empty
      </h1>
      <CreateColumnForm boardId={currentBoard.id} className="!bg-transparent" />
    </section>
  );

  const boardJsx = (
    <motion.section
      layout
      key={currentBoard.id}
      className="grid grow grid-rows-[1fr,auto] overflow-auto"
    >
      {/* key prop for framer-motion */}
      <motion.div className="flex gap-4 p-8">
        {currentBoard?.columns
          .sort((a, b) => a.index - b.index)
          .map((col) => (
            <Column key={col.index} boardId={currentBoard.id} column={col} />
          ))}

        <motion.div layout className="h-96">
          <CreateColumnForm boardId={currentBoard.id} />
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
