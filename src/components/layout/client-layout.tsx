"use client";

import { usePathname } from "next/navigation";
import Menus from "../menus/menus";
import Footer from "./footer";
import Background from "../background/background";
import { MotionGlobalConfig } from "framer-motion";
import { useSettings } from "~/context/settings-context";
import MobileMenu from "../menus/mobile-menu";
import ClientNav from "../client-nav";
const ClientLayout = ({
  children,
  loggedIn,
  name,
}: {
  children: React.ReactNode;
  loggedIn: boolean;
  name: string | null | undefined;
}) => {
  const { performanceMode } = useSettings();
  const pathname = usePathname();
  const isBoardsPage = pathname === "/boards";
  MotionGlobalConfig.skipAnimations = isBoardsPage ? performanceMode : false;
  return (
    <>
      <div
        className={
          isBoardsPage
            ? "relative flex h-[100dvh] flex-col"
            : "mx-auto flex min-h-screen flex-col justify-between"
        }
      >
        <ClientNav loggedIn={loggedIn} name={name} />
        {isBoardsPage && <Background />}
        {children}
        {!isBoardsPage && <Footer />}
        {isBoardsPage && <Menus />}
        <MobileMenu />
        <div id="modal-root" className="absolute h-0 w-0" />
      </div>
    </>
  );
};

export default ClientLayout;
