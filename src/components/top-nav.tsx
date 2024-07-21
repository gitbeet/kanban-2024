"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";
import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";

const TopNav = () => {
  const { getCurrentBoard, optimisticBoards } = useBoards();
  const { setShowSidebar } = useUI();
  const currentBoard = getCurrentBoard();

  const noBoards = !optimisticBoards.length;

  return (
    <nav className="flex items-center justify-between border border-b px-4 py-4">
      <SignedIn>
        <h1 className="text-2xl font-bold">Kanban</h1>

        <h1
          onClick={() => setShowSidebar((prev) => !prev)}
          className="w-full cursor-pointer text-center text-2xl font-medium"
        >
          {!noBoards && currentBoard?.name}
        </h1>

        <section className="flex items-center gap-4"></section>
        <UserButton />
      </SignedIn>
    </nav>
  );
};

export default TopNav;
