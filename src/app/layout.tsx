import "~/styles/globals.css";
import TopNav from "~/components/top-nav";
import { type Metadata } from "next";
import { getBoards } from "~/server/queries";
import Menus from "~/components/menus/menus";
import { Plus_Jakarta_Sans } from "next/font/google";
import Providers from "./providers";

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
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-dark mx-auto flex h-[100dvh] flex-col text-white">
        <Providers boards={boards}>
          <TopNav />
          {children}
          <Menus />
          <div id="modal-root" className="absolute h-0 w-0" />
        </Providers>
      </body>
    </html>
  );
}
