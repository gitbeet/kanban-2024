"use client";

import { useBoards } from "~/context/boards-context";
import { motion } from "framer-motion";
import CreateBoardForm from "./action-forms/board/create-board-form";
import { LoadingPage } from "./ui/loading-spinner";
import Column from "../components/column";
import DeleteTaskZone from "./delete-task-zone";
import CreateColumnForm from "./action-forms/column/create-column-form";
import { useEffect } from "react";

const Board = () => {
  const { optimisticBoards, loading, getCurrentBoard } = useBoards();
  const currentBoard = getCurrentBoard();

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      console.log("Focused element:", event.target);
    };

    document.addEventListener("focusin", handleFocusIn);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);
  if (loading.deleteBoard || loading.createBoard) return <LoadingPage />;

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

  // TODO:  Redirect / error component
  if (!currentBoard?.id) return <LoadingPage />;

  const emptyBoardJsx = (
    <section className="grid w-full place-content-center">
      <h1 className="w-full text-center text-3xl font-bold">
        This board is empty
      </h1>
      <CreateColumnForm boardId={currentBoard.id} className="h-32 w-80" />
    </section>
  );

  const boardJsx = (
    <motion.section
      layout
      // Key prop for framer-motion
      key={currentBoard.id}
      className="grid grow grid-rows-[1fr,auto] overflow-auto"
      tabIndex={-1}
    >
      <motion.div className="flex p-8">
        {currentBoard?.columns
          .sort((a, b) => a.index - b.index)
          .map((col) => (
            <Column key={col.index} boardId={currentBoard.id} column={col} />
          ))}

        <motion.div layout className="h-96 px-3">
          <CreateColumnForm
            className="menu-bg h-32 w-80 shrink-0"
            boardId={currentBoard.id}
          />
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
