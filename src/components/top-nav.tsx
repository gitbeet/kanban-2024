"use client";

import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";
import { SignedIn, UserButton } from "@clerk/nextjs";
const TopNav = () => {
  const { getCurrentBoard, optimisticBoards } = useBoards();
  const { setShowSidebar } = useUI();
  const currentBoard = getCurrentBoard();

  const noBoards = !optimisticBoards.length;

  return (
    <nav className="relative z-20 flex h-fit items-center justify-between border-b border-neutral-750 bg-neutral-800 px-4 py-6 shadow-md">
      <SignedIn>
        <h1 className="text-2xl font-bold">kanban</h1>

        <h1
          onClick={() => setShowSidebar((prev) => !prev)}
          className="w-full cursor-pointer text-center text-xl font-bold"
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
