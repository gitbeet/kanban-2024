"use client";

import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";
import { motion } from "framer-motion";
import useHasMounted from "~/hooks/useHasMounted";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import CreateBoardForm from "./action-forms/board/create-board-form";
import MakeBoardCurrentForm from "./action-forms/board/make-board-current-form";
import FocusTrap from "focus-trap-react";

const Sidebar = () => {
  const { showSidebar, setShowSidebar } = useUI();
  const { optimisticBoards, loading } = useBoards();
  const hasMounted = useHasMounted();

  return (
    <FocusTrap
      active={showSidebar}
      focusTrapOptions={{ escapeDeactivates: false }}
    >
      <motion.section
        layout
        className={`relative z-[5] ${showSidebar ? "ml-0 translate-x-0" : "-mr-64 -translate-x-64"} w-64 shrink-0 border-r border-neutral-700 bg-neutral-800 transition-all duration-300`}
      >
        <div className="h-8"></div>
        <h2 className="pl-6 text-sm font-bold uppercase text-neutral-500">
          All boards ({optimisticBoards.length})
        </h2>
        <div className="h-8"></div>
        <motion.ul>
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
                      tabIndex={showSidebar ? 1 : -1}
                      boardName={board.name}
                      boardId={board.id}
                    />
                  </div>
                </motion.li>
              </div>
            ))}
          <motion.li layout className="px-4">
            <div className="h-4"></div>
            <CreateBoardForm tabIndex={showSidebar ? 1 : -1} />
          </motion.li>
        </motion.ul>
        <button
          onClick={() => setShowSidebar((prev) => !prev)}
          className="absolute bottom-24 right-0 translate-x-full cursor-pointer rounded rounded-r-full bg-primary-700 px-5 py-3.5 text-xl text-white transition-colors duration-150 hover:bg-primary-650"
        >
          {showSidebar ? <FaEyeSlash /> : <FaEye />}
        </button>
      </motion.section>
    </FocusTrap>
  );
};

export default Sidebar;
