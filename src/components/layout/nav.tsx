"use client";

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Button } from "../ui/button/button";
import { usePathname } from "next/navigation";
import Logo from "../common/logo";
import MobileMenuButton from "../common/mobile-menu-button";
import NavLink from "../ui/common/nav-link";

const Nav = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { signOut, redirectToSignIn, user } = useClerk();
  const handleSignOut = async () => await signOut();
  const handleRedirectToSignIn = async () => await redirectToSignIn();
  const pathname = usePathname();
  const isBoardsPage = pathname === "/boards";

  return (
    <nav className="relative z-[15] border-b border-neutral-100 bg-white dark:border-neutral-750 dark:bg-neutral-900 dark:shadow-md">
      <div
        className={` ${isBoardsPage ? "" : "container"} section-padding relative z-10 flex h-fit items-center justify-between gap-8 py-2.5`}
      >
        <Logo />
        <ul className="absolute left-1/2 hidden -translate-x-1/2 gap-8 lg:flex">
          <li>
            <NavLink title="Home" href="/" />
          </li>
          <SignedIn>
            <li>
              <NavLink title="Boards" href="/boards" />
            </li>
          </SignedIn>
          <li>
            <NavLink title="About" href="/about" />
          </li>
          <li>
            <NavLink title="Contact" href="/contact" />
          </li>
        </ul>
        <SignedOut>
          <div className="hidden lg:block">
            <Button size="small" onClick={handleRedirectToSignIn}>
              Sign in
            </Button>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="hidden space-x-4 lg:block">
            <span className="text-secondary">
              Hello, <b className="text-primary">{user?.firstName ?? "user"}</b>
            </span>
            <Button size="small" variant="ghost" onClick={handleSignOut}>
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
