"use client";

import { useBoards } from "~/context/boards-context";
import { motion } from "framer-motion";
import CreateBoardForm from "../action-forms/board/create-board-form";
import { LoadingPage } from "../ui/loading-spinner";
import Column from "./column";
import DeleteTaskZone from "./delete-task-zone";
import CreateColumnForm from "../action-forms/column/create-column-form";
import { BoardsNav } from "../layout/boards-nav";
import BoardsSettings from "../menus/boards-settings";
import RenameBoardForm from "../action-forms/board/rename-board-form";

const Board = () => {
  const { optimisticBoards, loading, getCurrentBoard } = useBoards();
  const currentBoard = getCurrentBoard();

  if (loading.DELETE_BOARD || loading.createBoard) return <LoadingPage />;

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
    <section className="relative z-[2] grid w-full place-content-center">
      <BoardsNav />
      <BoardsSettings />
      <div className="bg-light__test rounded-md px-4 pt-8 drop-shadow-lg">
        <h1 className="text-dark w-full text-center text-3xl font-bold">
          This board is empty
        </h1>
        <CreateColumnForm boardId={currentBoard.id} className="h-32 w-80" />
      </div>
    </section>
  );

  const boardJsx = (
    <motion.div className="relative grow overflow-hidden">
      <BoardsNav />
      <BoardsSettings />
      <motion.section
        layout
        // Key prop for framer-motion
        key={currentBoard.id}
        className="grid h-full grow grid-rows-[1fr,auto] overflow-auto pt-12"
        tabIndex={-1}
      >
        <motion.div className="flex items-start gap-4 p-8">
          {currentBoard?.columns
            .sort((a, b) => a.index - b.index)
            .map((col) => (
              <Column key={col.index} boardId={currentBoard.id} column={col} />
            ))}

          <motion.div layout className="relative z-[2] h-96">
            <CreateColumnForm
              className="bg-light__test h-32 w-80 shrink-0 overflow-hidden rounded-md drop-shadow-lg"
              boardId={currentBoard.id}
            />
            <div className="h-4" />
            <DeleteTaskZone />
          </motion.div>
        </motion.div>
      </motion.section>
    </motion.div>
  );

  const isBoardEmpty = currentBoard?.columns.length === 0;

  return isBoardEmpty ? emptyBoardJsx : boardJsx;
};

export default Board;
