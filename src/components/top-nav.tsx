"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";
import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";
import DeleteBoardForm from "./action-forms/board/delete-board-form";

const TopNav = () => {
  const { getCurrentBoard, currentBoardId, optimisticBoards } = useBoards();
  const { setShowSidebar } = useUI();
  const currentBoard = optimisticBoards.find((b) => b.id === currentBoardId);

  return (
    <nav className="flex items-center justify-between border-b py-4">
      <SignedIn>
        <h1 className="text-2xl font-bold">Kanban</h1>
        {currentBoard && (
          <h1
            onClick={() => setShowSidebar((prev) => !prev)}
            className="flex items-center gap-4 text-2xl font-medium"
          >
            {currentBoard.name}
            <DeleteBoardForm boardId={currentBoard.id} />
          </h1>
        )}
        {!currentBoard && <h1>Current board not found {currentBoardId} </h1>}
        <section className="flex items-center gap-4"></section>
        <UserButton />
      </SignedIn>
    </nav>
  );
};

export default TopNav;
