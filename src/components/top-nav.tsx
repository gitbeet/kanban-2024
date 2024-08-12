"use client";

import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Button, MoreButton } from "./ui/button/buttons";
import MoreButtonMenu from "./ui/modal/more-button-menu";
import { useRef, useState } from "react";
import PromptWindow from "./ui/modal/prompt-window";
import DeleteBoardForm from "./action-forms/board/delete-board-form";
const TopNav = () => {
  const { getCurrentBoard, optimisticBoards } = useBoards();
  const { setShowSidebar } = useUI();
  const currentBoard = getCurrentBoard();
  const [showEditBoardWindow, setShowEditBoardWindow] = useState(false);
  const [showConfirmDeleteWindow, setShowConfirmDeleteWindow] = useState(false);
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
      showBackdrop={showEditBoardWindow && !showConfirmDeleteWindow}
      onClose={() => setShowEditBoardWindow(false)}
      zIndex={40}
    >
      <Button variant="ghost">Edit Board</Button>
      <Button onClick={() => setShowConfirmDeleteWindow(true)} variant="danger">
        Delete Board
      </Button>
    </MoreButtonMenu>
  );

  const confirmDeleteBoardWindowJSX = (
    <PromptWindow
      cancelButton={
        <Button onClick={() => setShowConfirmDeleteWindow(false)}>
          Cancel
        </Button>
      }
      confirmButton={
        <DeleteBoardForm
          boardId={currentBoard!.id}
          boardIndex={currentBoard!.index}
          button={
            <Button type="submit" variant="danger">
              Delete Board
            </Button>
          }
          externalAction={() => {
            setShowConfirmDeleteWindow(false);
            setShowEditBoardWindow(false);
          }}
        />
      }
      onClose={() => setShowConfirmDeleteWindow(false)}
      show={showConfirmDeleteWindow}
      showBackdrop={showConfirmDeleteWindow}
      zIndex={50}
      message={
        <span>
          Are you sure you want to delete the ‘
          <span className="font-bold">{currentBoard?.name}</span>’ board ,all
          its tasks and subtasks? This action cannot be reversed.
        </span>
      }
    />
  );

  return (
    <nav className="relative z-10 flex h-fit items-center justify-between gap-8 border-b border-neutral-750 bg-neutral-800 px-4 py-6 shadow-md">
      <h1 className="w-60 text-center text-2xl font-bold">kanban</h1>
      <button
        onClick={handleToggleShowSidebar}
        className="mr-auto cursor-pointer text-center text-xl font-bold"
      >
        <h1>{!noBoards && currentBoard?.name}</h1>
      </button>
      <MoreButton
        onClick={() => setShowEditBoardWindow(true)}
        ref={moreButtonRef}
      />
      {moreButtonMenuJSX}
      {currentBoard && confirmDeleteBoardWindowJSX}
      <UserButton />
    </nav>
  );
};

export default TopNav;
