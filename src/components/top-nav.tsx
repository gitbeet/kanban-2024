"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";
import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";

const TopNav = () => {
  const { getCurrentBoard } = useBoards();
  const { setShowSidebar } = useUI();
  const currentBoard = getCurrentBoard();
  if (!currentBoard)
    return <h1>Current board not found (placeholder error)</h1>;
  return (
    <nav className="flex items-center justify-between border-b py-4">
      <SignedIn>
        <h1 className="text-2xl font-bold">Kanban</h1>
        <h1
          onClick={() => setShowSidebar((prev) => !prev)}
          className="text-2xl font-medium"
        >
          {currentBoard.name}
        </h1>
        <section className="flex items-center gap-4">
          {/* <SelectBoard />
          <CreateBoardForm /> */}
        </section>
        <UserButton />
      </SignedIn>
    </nav>
  );
};

export default TopNav;
