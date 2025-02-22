"use client";

import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";
import { UserButton } from "@clerk/nextjs";
import { Button, MoreButton } from "./ui/button/buttons";
import MoreButtonMenu from "./ui/modal/more-button-menu";
import { useRef } from "react";
import EditBoard from "./menus/edit-board/edit-board";
const TopNav = () => {
  const { getCurrentBoard, optimisticBoards } = useBoards();
  const {
    setShowSidebar,
    sidebarAnimating,
    setShowEditBoardMenu,
    showEditBoardWindow,
    setShowEditBoardWindow,
    showConfirmDeleteBoardWindow,
    setShowConfirmDeleteBoardWindow,
  } = useUI();
  const currentBoard = getCurrentBoard();
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const noBoards = !optimisticBoards.length;

  const handleToggleShowSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const moreButtonMenuJSX = (
    <MoreButtonMenu
      position={{
        x: moreButtonRef.current?.getBoundingClientRect().left ?? 0,
        y: moreButtonRef.current?.getBoundingClientRect().top ?? 0,
      }}
      show={showEditBoardWindow}
      showBackdrop={showEditBoardWindow && !showConfirmDeleteBoardWindow}
      onClose={() => setShowEditBoardWindow(false)}
      zIndex={40}
    >
      <Button onClick={() => setShowEditBoardMenu(true)} variant="ghost">
        Edit Board
      </Button>
      <Button
        onClick={() => setShowConfirmDeleteBoardWindow(true)}
        variant="danger"
      >
        Delete Board
      </Button>
    </MoreButtonMenu>
  );

  return (
    <nav className="bg-light relative z-10 flex h-fit items-center justify-between gap-8 border-b border-transparent px-4 py-6 shadow-md dark:border-neutral-750">
      <h1 className="text-dark w-60 text-center text-2xl font-bold">kanban</h1>
      {!noBoards && (
        <button
          disabled={sidebarAnimating}
          onClick={handleToggleShowSidebar}
          className="mr-auto cursor-pointer text-center text-xl font-bold"
        >
          <h1 className="text-dark">{!noBoards && currentBoard?.name}</h1>
        </button>
      )}
      {currentBoard && (
        <MoreButton
          onClick={() => setShowEditBoardWindow(true)}
          ref={moreButtonRef}
        />
      )}
      {moreButtonMenuJSX}
      <UserButton />
    </nav>
  );
};

export default TopNav;
