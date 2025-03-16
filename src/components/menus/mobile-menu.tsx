import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import React from "react";
import { useUI } from "~/context/ui-context";
import { Button } from "../ui/button/buttons";

const MobileMenu = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { signOut, redirectToSignIn, user } = useClerk();
  const handleSignOut = async () => await signOut();
  const handleRedirectToSignIn = async () => await redirectToSignIn();
  //   const pathname = usePathname();
  //   const isBoardsPage = pathname === "/boards";
  const { showMobileMenu, setShowMobileMenu } = useUI();
  return (
    <div
      className={`${showMobileMenu ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-12 opacity-0"} section-padding bg-light absolute inset-0 z-[10] space-y-8 pt-32 backdrop-blur transition-[opacity,transform]`}
    >
      <ul className="space-y-4">
        <li onClick={() => setShowMobileMenu(false)}>
          <Link className="text-dark text-xl font-semibold" href="/">
            Home
          </Link>
        </li>
        <SignedIn>
          <li onClick={() => setShowMobileMenu(false)}>
            <Link className="text-dark text-xl font-semibold" href="/boards">
              Boards
            </Link>
          </li>
        </SignedIn>
        <li onClick={() => setShowMobileMenu(false)}>
          <Link className="text-dark text-xl font-semibold" href="/about">
            About
          </Link>
        </li>
        <li onClick={() => setShowMobileMenu(false)}>
          <Link className="text-dark text-xl font-semibold" href="/contact">
            Contact
          </Link>
        </li>
      </ul>
      <SignedOut>
        <div>
          <Button
            onClick={async () => {
              setShowMobileMenu(false);
              await handleRedirectToSignIn();
            }}
          >
            Sign in
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="space-x-4">
          <span className="text-light">
            Hello, <b className="text-dark">{user?.firstName ?? "user"}</b>
          </span>
          <Button
            variant="ghost"
            onClick={async () => {
              setShowMobileMenu(false);
              await handleSignOut();
            }}
          >
            Sign out
          </Button>
        </div>
      </SignedIn>
    </div>
  );
};

export default MobileMenu;
