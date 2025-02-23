"use client";

import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Button, MoreButton } from "./ui/button/buttons";
import MoreButtonMenu from "./ui/modal/more-button-menu";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./logo";

const TopNav = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { signOut, redirectToSignIn } = useClerk();
  const handleSignOut = async () => await signOut();
  const handleRedirectToSignIn = async () => await redirectToSignIn();
  const pathname = usePathname();
  const isBoardsPage = pathname === "/boards";

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
    <nav className="bg-light relative z-10 flex h-fit items-center justify-between gap-8 border-b border-transparent px-8 py-6 shadow-md dark:border-neutral-750">
      <Logo />
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
        <MoreButton
          onClick={() => setShowEditBoardWindow(true)}
          ref={moreButtonRef}
        />
      )}
      <SignedIn>
        {pathname !== "/boards" && (
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

export default TopNav;
