import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { BoardsProvider } from "~/context/boards-context";
import { UIProvider } from "~/context/ui-context";
import TopNav from "~/components/top-nav";
import { type Metadata } from "next";
import { getBoards } from "~/server/queries";
import Menus from "~/components/menus/menus";
import { Plus_Jakarta_Sans } from "next/font/google";
import { shadesOfPurple } from "@clerk/themes";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "KANBAN 2024",
  description: "KANBAN APP",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const boards = await getBoards();
  // await saveEditTaskChanges();
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple,
      }}
    >
      <UIProvider>
        <BoardsProvider boards={boards}>
          <html lang="en" className={`${plusJakartaSans.variable}`}>
            <body className="mx-auto flex h-[100dvh] flex-col bg-neutral-850 text-white">
              <TopNav />

              {children}
              <Menus />

              <div id="modal-root" className="absolute h-0 w-0" />
            </body>
          </html>
        </BoardsProvider>
      </UIProvider>
    </ClerkProvider>
  );
}
