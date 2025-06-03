"use client";

import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";
import { motion } from "framer-motion";
import CreateBoardForm from "../action-forms/board/create-board-form";
import MakeBoardCurrentForm from "../action-forms/board/make-board-current-form";
import FocusTrap from "focus-trap-react";
import { useRef } from "react";
import { FaChevronRight } from "react-icons/fa";
import {
  sidebarTransition,
  smallElementTransition,
} from "~/utilities/framer-motion";
import Text from "../ui/typography/text";

const Sidebar = () => {
  const { showSidebar, setShowSidebar, setSidebarAnimating, sidebarAnimating } =
    useUI();
  const { optimisticBoards } = useBoards();

  const outsideButtonRef = useRef<HTMLButtonElement | null>(null);

  const outsideButton = (
    <button
      aria-label={`${showSidebar ? "Close" : "Open"} the sidebar menu`}
      ref={outsideButtonRef}
      disabled={sidebarAnimating}
      onClick={() => setShowSidebar((prev) => !prev)}
      className={`transitionz-colors bg-dark text-primary absolute right-2 top-1.5 translate-x-full cursor-pointer rounded border border-neutral-250 p-2 text-sm text-white shadow dark:border-neutral-500`}
    >
      <FaChevronRight className={showSidebar ? "rotate-180" : ""} />
    </button>
  );

  const boards = optimisticBoards
    .sort((a, b) => a.index - b.index)
    .map((board) => (
      <motion.div key={board.id} layout className="h-fit">
        <motion.li layout className="group cursor-pointer">
          <MakeBoardCurrentForm
            tabIndex={showSidebar ? 0 : -1}
            boardName={board.name}
            boardId={board.id}
          />
        </motion.li>
      </motion.div>
    ));

  return (
    <motion.aside
      onAnimationStart={() => setSidebarAnimating(true)}
      onAnimationComplete={() => setSidebarAnimating(false)}
      initial={false}
      animate={{
        x: showSidebar ? 0 : -208,
      }}
      transition={sidebarTransition}
      className="bg-sidebar left-0 top-0 z-[5] h-full w-56 shrink-0 border-r shadow-xl dark:border-neutral-750"
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
            <Text variant="tertiary">
              <h2 className="pl-6 text-sm font-bold uppercase">
                All boards ({optimisticBoards.length})
              </h2>
            </Text>
            <div className="h-8"></div>
            <motion.ul
              layout
              className="max-h-[60dvh] overflow-auto scrollbar-thin"
            >
              {boards}
            </motion.ul>
            <motion.div
              layout
              transition={smallElementTransition}
              className="px-4"
            >
              <div className="h-4"></div>
              <CreateBoardForm
                tabIndex={showSidebar ? 0 : -1}
                className="pl-2"
              />
            </motion.div>
          </div>
          {outsideButton}
        </div>
      </FocusTrap>
    </motion.aside>
  );
};

export default Sidebar;
