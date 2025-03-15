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
import MobileMenuButton from "../ui/mobile-menu-button";

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
          className="text-dark cursor-pointer text-center text-xl font-bold md:ml-32"
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
    <nav className="bg-light border-color relative z-[15] border-b shadow-sm">
      <div
        className={` ${isBoardsPage ? "" : "container"} section-padding relative z-10 flex h-fit items-center justify-between gap-8 py-5`}
      >
        <Logo />
        {isBoardsPage && boardsPageContent}
        {!isBoardsPage && (
          <ul className="absolute left-1/2 hidden -translate-x-1/2 gap-8 lg:flex">
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
          <div className="hidden lg:block">
            <Button onClick={handleRedirectToSignIn}>Sign in</Button>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="hidden space-x-4 lg:block">
            <span className="text-light">
              Hello, <b className="text-dark">{user?.firstName ?? "user"}</b>
            </span>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </SignedIn>
        <MobileMenuButton />
      </div>
    </nav>
  );
};

export default Nav;
