"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { ThemeProvider } from "next-themes";
import { BackgroundProvider } from "~/context/bg-context";
import { BoardsProvider } from "~/context/boards-context";
import { UIProvider } from "~/context/ui-context";
import { type BoardType } from "~/types";

const Providers = ({
  boards,
  children,
}: {
  boards: BoardType[];
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple,
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BackgroundProvider>
          <UIProvider>
            <BoardsProvider boards={boards}>{children}</BoardsProvider>
          </UIProvider>
        </BackgroundProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default Providers;
