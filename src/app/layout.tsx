import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import { BoardsProvider } from "~/context/boards-context";
import { getBoards } from "~/server/queries";

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
      <BoardsProvider boards={boards}>
        <html lang="en" className={`${GeistSans.variable}`}>
          <body className="mx-auto max-w-[1600px] bg-neutral-900 text-white">
            <nav className="flex justify-between border-b py-4">
              <SignedIn>
                <h1 className="text-2xl font-bold">Kanban</h1>
                <UserButton />
              </SignedIn>
            </nav>
            {children}
          </body>
        </html>
      </BoardsProvider>
    </ClerkProvider>
  );
}
