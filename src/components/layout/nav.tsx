"use client";

import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Button, MoreButton } from "../ui/button/buttons";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "../logo";
import EditBoardSmallMenu from "../menus/edit-board/edit-board-small-menu";

const Nav = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { signOut, redirectToSignIn } = useClerk();
  const handleSignOut = async () => await signOut();
  const handleRedirectToSignIn = async () => await redirectToSignIn();
  const pathname = usePathname();
  const isBoardsPage = pathname === "/boards";

  const { getCurrentBoard, optimisticBoards } = useBoards();
  const { setShowSidebar, sidebarAnimating, setShowEditBoardWindow } = useUI();
  const currentBoard = getCurrentBoard();
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const noBoards = !optimisticBoards.length;

  const handleToggleShowSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const boardsPageContent = (
    <>
      {/* Board name button */}
      {isBoardsPage && !noBoards && (
        <button
          disabled={sidebarAnimating}
          onClick={handleToggleShowSidebar}
          className="ml-32 mr-auto cursor-pointer text-center text-xl font-bold"
        >
          <h1 className="text-dark">{!noBoards && currentBoard?.name}</h1>
        </button>
      )}
      {isBoardsPage && currentBoard && (
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
    </>
  );

  return (
    <nav className="bg-light relative z-10 flex h-fit items-center justify-between gap-8 border-b border-transparent px-8 py-6 shadow-md dark:border-neutral-750">
      <Logo />
      {boardsPageContent}
      <SignedIn>
        {!isBoardsPage && (
          <Link href="/boards" className="text-dark font-bold">
            Boards
          </Link>
        )}
      </SignedIn>
      <SignedOut>
        <Button onClick={handleRedirectToSignIn}>Sign in</Button>
      </SignedOut>
      <SignedIn>
        <Button onClick={handleSignOut}>Sign out</Button>
      </SignedIn>
    </nav>
  );
};

export default Nav;
