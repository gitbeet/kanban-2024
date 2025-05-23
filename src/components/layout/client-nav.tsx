"use client";

import Logo from "../common/logo";
import SignOutButton from "../ui/button/auth-buttons/sign-out-button";
import SignInButton from "../ui/button/auth-buttons/sign-in-button";
import { usePathname } from "next/navigation";
import MobileMenuButton from "../common/mobile-menu-button";
import NavLink from "../ui/common/nav-link";
import Text from "../ui/typography/text";
const ClientNav = ({
  loggedIn,
  name,
}: {
  loggedIn: boolean;
  name: string | null | undefined;
}) => {
  const pathname = usePathname();
  const isBoardsPage = pathname === "/boards";
  return (
    <nav className="relative z-[15] border-b border-neutral-100 bg-white dark:border-neutral-750 dark:bg-neutral-900 dark:shadow-md">
      <div
        className={` ${isBoardsPage ? "" : "container"} section-padding relative z-10 flex h-fit items-center justify-between gap-8 py-2.5`}
      >
        <Logo />
        {loggedIn && (
          <ul className="absolute left-1/2 hidden -translate-x-1/2 gap-8 lg:flex">
            <li>
              <NavLink href="/" title="Home" />
            </li>
            <li>
              <NavLink href="/boards" title="Boards" />
            </li>
          </ul>
        )}
        {loggedIn && (
          <>
            <div className="hidden items-center gap-2 lg:flex">
              <p className="text-sm">
                <Text variant="secondary">
                  <span>Hello, </span>
                </Text>
                <Text variant="primary">
                  <b>{name}</b>
                </Text>
              </p>
              <SignOutButton size="small" variant="ghost" />
            </div>
          </>
        )}
        {!loggedIn && (
          <>
            <div className="hidden lg:block">
              <SignInButton size="small" variant="primary" />
            </div>
          </>
        )}
        <MobileMenuButton />
      </div>
    </nav>
  );
};

export default ClientNav;
