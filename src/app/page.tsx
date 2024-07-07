import Board from "~/components/board";
import { getBoards } from "~/server/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const boards = await getBoards();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <section className="flex gap-32">
        {boards.map((board) => (
          <Board board={board} key={board.id} />
        ))}
      </section>
    </main>
  );
}
