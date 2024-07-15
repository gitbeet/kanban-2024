"use client";

import React from "react";
import type { BoardType } from "../types";
import Column from "../components/column";
import { useUser } from "@clerk/nextjs";
import DeleteTaskZone from "./delete-task-zone";
import RenameBoardForm from "./action-forms/board/rename-board-form";
import DeleteBoardForm from "./action-forms/board/delete-board-form";
import CreateColumnForm from "./action-forms/column/create-column-form";
import { motion } from "framer-motion";

const Board = ({ board }: { board: BoardType }) => {
  const { user } = useUser();

  if (!user?.id) return <h1>Please log in (placeholder error)</h1>;

  return (
    <section className="overflow-x-scroll">
      <div className="flex items-start gap-4">
        <h2 className="pb-4 text-xl">{board.name}</h2>
        <RenameBoardForm board={board} />
        <DeleteBoardForm board={board} />
        <CreateColumnForm board={board} />
      </div>
      <div className="shrink-0">
        <h2 className="pb-4 text-xl font-bold">Columns</h2>
        <motion.div className="flex gap-4">
          {board.columns.map((col) => (
            <Column key={col.index} board={board} column={col} />
          ))}

          <motion.div className="flex gap-4" layout>
            <CreateColumnForm board={board} jsx="block" />
            <DeleteTaskZone board={board} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Board;
