import { type Metadata } from "next";
import type { UserDataType, BoardType } from "~/types";
import { Roboto } from "next/font/google";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import ClientLayout from "~/components/layout/client-layout";
import "~/styles/globals.css";
import type { BackgroundType, UserBackgroundType } from "~/types/background";
import { unstable_cache as cache } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserData } from "~/server/server-actions/user-data/get-user-data";
import { getBackgrounds } from "~/server/server-actions/background/get-background";
import { getUserBackgrounds } from "~/server/server-actions/background/get-user-backgrounds";
import { getBoards } from "~/server/server-actions/board/get-boards";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
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
  let boards: BoardType[] = [];
  let backgrounds: BackgroundType[] = [];
  let userBackgrounds: UserBackgroundType[] = [];
  let userData: UserDataType;

  const boardsResult = await getBoards();
  if (boardsResult.boards) {
    boards = boardsResult.boards;
  }

  const userBackgroundsResult = await getUserBackgrounds();
  if (userBackgroundsResult.backgrounds) {
    userBackgrounds = userBackgroundsResult.backgrounds.map((b) => ({
      ...b,
      type: "user",
    }));
  }

  const backgroundsResult = await cache(
    () => getBackgrounds(),
    ["all-backgrounds"],
    {
      tags: ["backgrounds"],
      revalidate: 86400,
    },
  )();

  if (backgroundsResult.backgrounds) {
    backgrounds = backgroundsResult.backgrounds;
  }

  const userDataResult = await getUserData();
  if (userDataResult.data) {
    userData = userDataResult.data;
  }

  const { userId } = auth();
  const user = userId ? await currentUser() : null;

  return (
    <html lang="en" className={`${roboto.variable}`} suppressHydrationWarning>
      <body>
        <Providers
          boards={boards}
          userBackgrounds={userBackgrounds}
          backgrounds={backgrounds}
          userData={userData!}
        >
          <Toaster
            position="bottom-center"
            toastOptions={{
              className: "bg-light__test text-dark",
              duration: 10000,
            }}
          />
          <ClientLayout loggedIn={!!user} name={user?.firstName}>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
