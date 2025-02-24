import "~/styles/globals.css";
import { type Metadata } from "next";
import { getBoards } from "~/server/queries";
import { Plus_Jakarta_Sans } from "next/font/google";
import Providers from "./providers";
import ClientLayout from "~/components/layout/client-layout";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "700", "800"],
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
      <body>
        <Providers boards={boards}>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
