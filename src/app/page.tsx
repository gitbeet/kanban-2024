import Boards from "~/components/boards";
import { getBoards } from "~/server/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const boards = await getBoards();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Boards boards={boards} />
    </main>
  );
}
