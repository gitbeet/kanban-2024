"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";
import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";

const TopNav = () => {
  const { currentBoardId, optimisticBoards } = useBoards();
  const { setShowSidebar } = useUI();
  const currentBoard = optimisticBoards.find((b) => b.id === currentBoardId);

  return (
    <nav className="flex items-center justify-between border border-b px-4 py-4">
      <SignedIn>
        <h1 className="text-2xl font-bold">Kanban</h1>
        {currentBoard && (
          <h1
            onClick={() => setShowSidebar((prev) => !prev)}
            className="w-full cursor-pointer text-center text-2xl font-medium"
          >
            {currentBoard.name}
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
