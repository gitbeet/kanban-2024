"use client";

import { useBoards } from "~/context/boards-context";
import { motion } from "framer-motion";
import CreateBoardForm from "../action-forms/board/create-board-form";
import Column from "./column";
import DeleteTaskZone from "./delete-task-zone";
import CreateColumnForm from "../action-forms/column/create-column-form";
import { BoardsNav } from "../layout/boards-nav";
import BoardsSettings from "../menus/boards-settings";
import { useUI } from "~/context/ui-context";
import { sidebarTransition } from "~/utilities/framer-motion";
import Text from "../ui/typography/text";
import { type ReactNode } from "react";
import LoadingPage from "../ui/loading/loading-page";

const BlockHeading = ({ title }: { title: string }) => (
  <Text variant="primary">
    <h1 className="w-full text-center text-3xl font-bold">{title}</h1>
  </Text>
);

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="bg-column space-y-6 rounded-md px-12 py-9 drop-shadow-lg">
    <BlockHeading title={title} />
    {children}
  </div>
);

const Board = () => {
  const { optimisticBoards, boardsLoading, getCurrentBoard } = useBoards();
  const currentBoard = getCurrentBoard();
  const { showSidebar } = useUI();
  if (
    boardsLoading.deleteBoard ||
    boardsLoading.createBoard ||
    boardsLoading.makeBoardCurrent
  )
    return <LoadingPage />;

  const noBoards = optimisticBoards.length === 0;
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
      <Block title="You have no boards">
        <CreateBoardForm className="text-center" />
      </Block>
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
      <Block title="This board is empty">
        <CreateColumnForm boardId={currentBoard.id} />
      </Block>
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
              className="bg-column h-32 w-80 shrink-0 overflow-hidden rounded-md drop-shadow-lg"
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
