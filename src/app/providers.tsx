"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { ThemeProvider } from "next-themes";
import { BackgroundProvider } from "~/context/bg-context";
import { BoardsProvider } from "~/context/boards-context";
import { UIProvider } from "~/context/ui-context";
import type { UserDataType, BoardType } from "~/types";
import type { BackgroundType, UserBackgroundType } from "~/types/background";

const Providers = ({
  boards,
  backgrounds,
  userBackgrounds,
  userData,
  children,
}: {
  boards: BoardType[];
  backgrounds: BackgroundType[];
  userBackgrounds: UserBackgroundType[];
  children: React.ReactNode;
  userData: UserDataType | undefined;
}) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple,
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BackgroundProvider
          userBackgrounds={userBackgrounds}
          backgrounds={backgrounds}
          userData={userData}
        >
          <UIProvider>
            <BoardsProvider boards={boards}>{children}</BoardsProvider>
          </UIProvider>
        </BackgroundProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default Providers;
