import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";
import { useRef } from "react";
import EditBoardSmallMenu from "../menus/edit-board/edit-board-small-menu";
import { Button } from "../ui/button/button";
import SettingsButton from "../ui/button/settings-button";
import MoreButton from "../ui/button/more-button";
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
          <button disabled={sidebarAnimating} onClick={handleToggleShowSidebar}>
            <Text variant="primary" hover>
              <p className="text-xl font-bold">{currentBoard?.name}</p>
            </Text>
          </button>
        )}
      </div>
      <SettingsButton
        onClick={() => setShowBoardsSettings((prev) => !prev)}
        disabled={boardsSettingsAnimating}
      />
    </div>
  );
};
