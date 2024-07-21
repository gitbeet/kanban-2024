import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { BoardsProvider } from "~/context/boards-context";
import { UIProvider } from "~/context/ui-context";
import TopNav from "~/components/top-nav";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { deleteSubtask, getBoards } from "~/server/queries";

export const metadata: Metadata = {
  title: "KANBAN 2024",
  description: "KANBAN APP",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const boards = await getBoards();
  return (
    <ClerkProvider>
      <UIProvider>
        <BoardsProvider boards={boards}>
          <html lang="en" className={`${GeistSans.variable}`}>
            <body className="mx-auto flex h-[100dvh] flex-col bg-neutral-800 text-white">
              <TopNav />
              {children}
            </body>
          </html>
        </BoardsProvider>
      </UIProvider>
    </ClerkProvider>
  );
}
