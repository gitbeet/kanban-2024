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
import { useUI } from "~/context/ui-context";
import { sidebarTransition } from "~/utilities/framer-motion";

const Board = () => {
  const { optimisticBoards, loading, getCurrentBoard } = useBoards();
  const currentBoard = getCurrentBoard();
  const { showSidebar } = useUI();
  if (loading.DELETE_BOARD || loading.createBoard) return <LoadingPage />;

  const noBoards = !optimisticBoards.length;
  const noBoardsJsx = (
    <motion.section
      initial={false}
      animate={{
        marginLeft: showSidebar ? "0" : "-14rem",
      }}
      transition={sidebarTransition}
      className="relative z-[2] grid grow place-content-center overflow-hidden"
    >
      <BoardsNav />
      <BoardsSettings />
      <div className="bg-light__test space-y-8 rounded-md p-12 drop-shadow-lg">
        <h1 className="text-dark w-full text-center text-3xl font-bold">
          You have no boards
        </h1>
        <CreateBoardForm className="text-center" />
      </div>
    </motion.section>
  );

  if (noBoards) return noBoardsJsx;

  // TODO:  Redirect / error component
  if (!currentBoard?.id) return <LoadingPage />;

  const emptyBoardJsx = (
    <motion.section
      initial={false}
      animate={{
        marginLeft: showSidebar ? "0" : "-14rem",
      }}
      transition={sidebarTransition}
      className="relative z-[2] grid grow place-content-center overflow-hidden"
    >
      <BoardsNav />
      <BoardsSettings />
      <div className="bg-light__test rounded-md px-4 pt-8 drop-shadow-lg">
        <h1 className="text-dark w-full text-center text-3xl font-bold">
          This board is empty
        </h1>
        <CreateColumnForm boardId={currentBoard.id} className="h-32 w-80" />
      </div>
    </motion.section>
  );

  const boardJsx = (
    <motion.section
      initial={false}
      animate={{
        marginLeft: showSidebar ? "0" : "-14rem",
      }}
      transition={sidebarTransition}
      className="relative grow overflow-hidden"
    >
      <BoardsNav />
      <BoardsSettings />
      <section
        // Key prop for framer-motion
        key={currentBoard.id}
        className="grid h-full grow grid-rows-[1fr,auto] overflow-auto pt-12"
        tabIndex={-1}
      >
        <motion.div
          layout
          transition={sidebarTransition}
          className="flex items-start gap-4 p-8"
        >
          {currentBoard?.columns
            .sort((a, b) => a.index - b.index)
            .map((col) => (
              <Column key={col.index} boardId={currentBoard.id} column={col} />
            ))}

          <motion.div
            layout
            transition={sidebarTransition}
            className="relative z-[2] h-96"
          >
            <CreateColumnForm
              className="bg-light__test h-32 w-80 shrink-0 overflow-hidden rounded-md drop-shadow-lg"
              boardId={currentBoard.id}
            />
            <div className="h-4" />
            <DeleteTaskZone />
          </motion.div>
        </motion.div>
      </section>
    </motion.section>
  );

  const isBoardEmpty = currentBoard?.columns.length === 0;

  return isBoardEmpty ? emptyBoardJsx : boardJsx;
};

export default Board;
