"use client";

import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";
import { motion } from "framer-motion";
import useHasMounted from "~/hooks/useHasMounted";
import CreateBoardForm from "./action-forms/board/create-board-form";
import MakeBoardCurrentForm from "./action-forms/board/make-board-current-form";
import FocusTrap from "focus-trap-react";
import { useRef } from "react";
import { FaChevronRight } from "react-icons/fa";

const Sidebar = () => {
  const { showSidebar, setShowSidebar, setSidebarAnimating, sidebarAnimating } =
    useUI();
  const { optimisticBoards, loading } = useBoards();
  const hasMounted = useHasMounted();

  const outsideButtonRef = useRef<HTMLButtonElement | null>(null);

  const outsideButton = (
    <button
      ref={outsideButtonRef}
      disabled={sidebarAnimating}
      onClick={() => setShowSidebar((prev) => !prev)}
      className={`transitionz-colors bg-dark text-dark absolute right-2 top-1.5 translate-x-full cursor-pointer rounded border border-neutral-250 p-2 text-sm text-white shadow dark:border-neutral-500`}
    >
      <FaChevronRight className={showSidebar ? "rotate-180" : ""} />
    </button>
  );

  const boards = optimisticBoards
    .sort((a, b) => a.index - b.index)
    .map((board) => (
      <div className="h-fit overflow-hidden" key={board.index}>
        <motion.li
          layout
          initial={
            hasMounted && !loading.createBoard ? { y: "-100%", opacity: 0 } : {}
          }
          animate={{
            y: 0,
            opacity: 1,
            transition: { ease: "easeInOut" },
          }}
          exit={{ y: "-100%", opacity: 0 }}
          className={`group cursor-pointer pr-4`}
        >
          <MakeBoardCurrentForm
            tabIndex={showSidebar ? 0 : -1}
            boardName={board.name}
            boardId={board.id}
          />
        </motion.li>
      </div>
    ));

  return (
    <motion.section
      onTransitionStart={() => setSidebarAnimating(true)}
      onTransitionEnd={() => setSidebarAnimating(false)}
      className={`relative z-[5] ${showSidebar ? "ml-0 translate-x-0" : "-mr-52 -translate-x-52"} bg-light__test-2 border-color__test w-56 shrink-0 border-r shadow-md transition-all duration-300 dark:border-neutral-750`}
    >
      <FocusTrap
        active={showSidebar}
        focusTrapOptions={{
          escapeDeactivates: true,
          initialFocus: () => outsideButtonRef.current,
          allowOutsideClick: true,
          clickOutsideDeactivates: true,
        }}
      >
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <div className="h-8"></div>
            <h2 className="pl-6 text-sm font-bold uppercase text-neutral-500">
              All boards ({optimisticBoards.length})
            </h2>
            <div className="h-8"></div>
            <motion.ul>
              {boards}
              <motion.li layout className="px-4">
                <div className="h-4"></div>
                <CreateBoardForm tabIndex={showSidebar ? 0 : -1} />
              </motion.li>
            </motion.ul>
          </div>
          {outsideButton}
        </div>
      </FocusTrap>
    </motion.section>
  );
};

export default Sidebar;
