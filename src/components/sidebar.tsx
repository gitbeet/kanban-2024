"use client";

import React, { useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";
import { AnimatePresence, motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import CreateBoardForm from "./action-forms/board/create-board-form";
import DeleteBoardForm from "./action-forms/board/delete-board-form";
import useHasMounted from "~/hooks/useHasMounted";
import MakeBoardCurrentForm from "./action-forms/board/make-board-current-form";

const Sidebar = () => {
  const { showSidebar, setShowSidebar } = useUI();
  const { optimisticBoards, loading, getCurrentBoard, setOptimisticBoards } =
    useBoards();
  const currentBoard = getCurrentBoard();
  const hasMounted = useHasMounted();
  const [pending, startTransition] = useTransition();

  return (
    <motion.section
      layout
      className={`relative z-10 ${showSidebar ? "ml-0 translate-x-0" : "-mr-64 -translate-x-64"} w-64 shrink-0 border-r transition-all duration-300`}
    >
      <div className="h-8"></div>
      <h2 className="pl-4 text-xl font-medium">
        All boards ({optimisticBoards.length})
      </h2>
      <div className="h-12"></div>
      <motion.ul>
        {/* <AnimatePresence mode="popLayout"> */}
        {optimisticBoards
          .sort((a, b) => a.index - b.index)
          .map((board) => (
            <div className="h-fit overflow-hidden" key={board.index}>
              <motion.li
                layout
                initial={
                  hasMounted && !loading.createBoard
                    ? { y: "-100%", opacity: 0 }
                    : {}
                }
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { ease: "easeInOut" },
                }}
                exit={{ y: "-100%", opacity: 0 }}
                className={`group cursor-pointer pr-4`}
              >
                <div className="flex items-center justify-between gap-4">
                  <MakeBoardCurrentForm
                    boardName={board.name}
                    boardId={board.id}
                  />
                  <DeleteBoardForm
                    className="opacity-0 group-hover:opacity-100"
                    boardId={board.id}
                    boardIndex={board.index}
                  />
                </div>
              </motion.li>
            </div>
          ))}
        <motion.li layout className="px-4">
          <div className="h-4"></div>

          <CreateBoardForm />
        </motion.li>
        {/* </AnimatePresence> */}
      </motion.ul>
      <div className="h-16"></div>

      <p className="pl-4">Dark mode button</p>
      <p
        onClick={() => setShowSidebar((prev) => !prev)}
        className="absolute bottom-32 right-0 translate-x-full cursor-pointer rounded rounded-r-full border bg-white px-4 py-3 text-xl text-neutral-800"
      >
        {showSidebar ? <FaEyeSlash /> : <FaEye />}
      </p>
    </motion.section>
  );
};

export default Sidebar;
