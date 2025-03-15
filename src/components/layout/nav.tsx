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
  const { signOut, redirectToSignIn, user } = useClerk();
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
    <div className="flex grow items-center justify-between">
      {/* Board name button */}
      {isBoardsPage && !noBoards && (
        <button
          disabled={sidebarAnimating}
          onClick={handleToggleShowSidebar}
          className="text-dark ml-32 cursor-pointer text-center text-xl font-bold"
        >
          {!noBoards && currentBoard?.name}
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
    </div>
  );

  return (
    <nav className="bg-light border-b border-transparent shadow-sm">
      <div
        className={` ${isBoardsPage ? "" : "container"} relative z-10 flex h-fit items-center justify-between gap-8 px-8 py-5`}
      >
        <Logo />
        {isBoardsPage && boardsPageContent}
        {!isBoardsPage && (
          <ul className="absolute left-1/2 flex -translate-x-1/2 gap-8">
            <li>
              <Link className="text-dark" href="/">
                Home
              </Link>
            </li>
            <SignedIn>
              <li>
                <Link href="/boards" className="text-dark">
                  Boards
                </Link>
              </li>
            </SignedIn>
            <li>
              <Link className="text-dark" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="text-dark" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        )}
        <SignedOut>
          <Button onClick={handleRedirectToSignIn}>Sign in</Button>
        </SignedOut>
        <SignedIn>
          <div className="space-x-4">
            <span className="text-light">
              Hello, <b className="text-dark">{user?.firstName ?? "user"}</b>
            </span>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </SignedIn>
      </div>
    </nav>
  );
};

export default Nav;
