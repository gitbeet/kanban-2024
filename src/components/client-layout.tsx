"use client";

import { usePathname } from "next/navigation";
import Menus from "./menus/menus";
import TopNav from "./top-nav";
import Footer from "./footer";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isBoardsPage = pathname === "/boards";
  return (
    <>
      <div
        className={` ${isBoardsPage ? "flex h-[100dvh] flex-col" : "mx-auto flex min-h-screen flex-col justify-between"} bg-dark text-white`}
      >
        <TopNav />
        {children}
        <Menus />
        {!isBoardsPage && <Footer />}
        <div id="modal-root" className="absolute h-0 w-0" />
      </div>
    </>
  );
};

export default ClientLayout;
