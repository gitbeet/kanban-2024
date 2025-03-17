import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";
import { MoreButton, SettingsButton } from "~/components/ui/button/buttons";
import { useRef } from "react";
import EditBoardSmallMenu from "~/components/menus/edit-board/edit-board-small-menu";
import { FaArrowRight, FaChevronRight } from "react-icons/fa";

export const BoardsNav = () => {
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const { getCurrentBoard, optimisticBoards } = useBoards();
  const {
    setShowSidebar,
    sidebarAnimating,
    setShowEditBoardWindow,
    setShowBoardsSettings,
  } = useUI();
  const currentBoard = getCurrentBoard();

  const noBoards = !optimisticBoards.length;
  const handleToggleShowSidebar = () => {
    setShowSidebar((prev) => !prev);
  };
  return (
    <div
      className={`section-padding absolute flex w-full grow items-center justify-between bg-neutral-50/50 py-2 shadow backdrop-blur-md dark:bg-neutral-850/40`}
    >
      <div className="flex items-center gap-4">
        {currentBoard && (
          <>
            {/* 3 dots button */}
            <MoreButton
              onClick={() => setShowEditBoardWindow(true)}
              ref={moreButtonRef}
            />

            <EditBoardSmallMenu
              position={{
                x: moreButtonRef.current?.getBoundingClientRect().left ?? 0,
                y: moreButtonRef.current?.getBoundingClientRect().top ?? 0,
              }}
            />
          </>
        )}
        {/* Board name button */}
        {!noBoards && (
          <button
            disabled={sidebarAnimating}
            onClick={handleToggleShowSidebar}
            className="text-dark cursor-pointer text-center text-xl font-bold"
          >
            {!noBoards && currentBoard?.name}
          </button>
        )}
      </div>
      <SettingsButton onClick={() => setShowBoardsSettings((prev) => !prev)} />
    </div>
  );
};
