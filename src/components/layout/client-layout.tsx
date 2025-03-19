"use client";

import { usePathname } from "next/navigation";
import Menus from "../menus/menus";
import Nav from "./nav";
import Footer from "./footer";
import Background from "../background/background";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isBoardsPage = pathname === "/boards";
  return (
    <>
      <div
        className={` ${isBoardsPage ? "relative flex h-[100dvh] flex-col" : "mx-auto flex min-h-screen flex-col justify-between"} bg-dark text-white`}
      >
        <Background />
        <Nav />
        {children}
        {!isBoardsPage && <Footer />}
        <Menus />
        <div id="modal-root" className="absolute h-0 w-0" />
      </div>
    </>
  );
};

export default ClientLayout;
