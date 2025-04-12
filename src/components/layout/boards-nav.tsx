import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";
import {
  Button,
  MoreButton,
  SettingsButton,
} from "~/components/ui/button/buttons";
import { useRef } from "react";
import EditBoardSmallMenu from "../menus/edit-board/edit-board-small-menu";
import Text from "../ui/typography/text";

export const BoardsNav = () => {
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const { getCurrentBoard, optimisticBoards } = useBoards();
  const {
    setShowSidebar,
    sidebarAnimating,
    setShowEditBoardWindow,
    setShowBoardsSettings,
    boardsSettingsAnimating,
  } = useUI();
  const currentBoard = getCurrentBoard();

  const noBoards = !optimisticBoards.length;
  const handleToggleShowSidebar = () => {
    setShowSidebar((prev) => !prev);
  };
  return (
    <div
      className={`section-padding absolute flex w-full grow items-center justify-between bg-neutral-50/50 py-2 drop-shadow-md backdrop-blur-md dark:bg-neutral-850/40`}
    >
      <div className="flex items-center gap-4 pl-6">
        {currentBoard && (
          <>
            {/* 3 dots button */}
            <MoreButton
              onClick={() => {
                setShowEditBoardWindow(true);
              }}
              ref={moreButtonRef}
            />
            <EditBoardSmallMenu
              buttonLeft={
                moreButtonRef.current?.getBoundingClientRect().left ?? 0
              }
              buttonWidth={
                moreButtonRef.current?.getBoundingClientRect().width ?? 0
              }
              buttonBottom={
                moreButtonRef.current?.getBoundingClientRect().bottom ?? 0
              }
            />
          </>
        )}
        {/* Board name button */}
        {!noBoards && (
          <Button
            disabled={sidebarAnimating}
            onClick={handleToggleShowSidebar}
            className="text-xl"
            variant="text"
          >
            {!noBoards && currentBoard?.name}
          </Button>
        )}
      </div>
      <SettingsButton
        onClick={() => setShowBoardsSettings((prev) => !prev)}
        disabled={boardsSettingsAnimating}
      />
    </div>
  );
};
