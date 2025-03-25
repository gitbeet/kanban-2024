import { type Metadata } from "next";
import { UserBackgroundType, type BoardType } from "~/types";
import { getBackgrounds, getBoards } from "~/server/queries";
import { Roboto } from "next/font/google";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import ClientLayout from "~/components/layout/client-layout";
import "~/styles/globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
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
  let userBackgrounds: UserBackgroundType[] = [];
  const boardsResult = await getBoards();
  if (boardsResult.boards) {
    boards = boardsResult.boards;
  }
  const backgroundsResult = await getBackgrounds();
  if (backgroundsResult.backgrounds) {
    userBackgrounds = backgroundsResult.backgrounds;
  }
  return (
    <html lang="en" className={`${roboto.variable}`} suppressHydrationWarning>
      <body>
        <Providers boards={boards} userBackgrounds={userBackgrounds}>
          <Toaster
            position="bottom-center"
            toastOptions={{
              className: "bg-light__test text-dark",
              duration: 10000,
            }}
          />
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
