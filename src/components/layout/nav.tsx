"use client";

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Button } from "../ui/button/buttons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "../common/logo";
import MobileMenuButton from "../ui/mobile-menu-button";

const Nav = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { signOut, redirectToSignIn, user } = useClerk();
  const handleSignOut = async () => await signOut();
  const handleRedirectToSignIn = async () => await redirectToSignIn();
  const pathname = usePathname();
  const isBoardsPage = pathname === "/boards";

  return (
    <nav className="bg-light__test-2 border-color__test relative z-[15] border-b shadow">
      <div
        className={` ${isBoardsPage ? "" : "container"} section-padding relative z-10 flex h-fit items-center justify-between gap-8 py-2`}
      >
        <Logo />
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
