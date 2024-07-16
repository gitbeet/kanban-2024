import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { BoardsProvider } from "~/context/boards-context";
import { getBoards } from "~/server/queries";
import TopNav from "~/components/top-nav";
import { UIProvider } from "~/context/ui-context";

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
            <body className="mx-auto grid h-[92dvh] max-w-[1600px] grid-rows-[1fr,100%] bg-neutral-900 text-white">
              <TopNav />
              {children}
            </body>
          </html>
        </BoardsProvider>
      </UIProvider>
    </ClerkProvider>
  );
}
