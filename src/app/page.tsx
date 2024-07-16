import Board from "~/components/board";
import Sidebar from "~/components/sidebar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    // <main className="grid grid-cols-[1fr,100%] overflow-hidden border">
    <main className="flex overflow-hidden border">
      <Sidebar />
      <Board />
    </main>
  );
}
