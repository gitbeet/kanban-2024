import Boards from "~/components/boards";
import { getBoards } from "~/server/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const boards = await getBoards();

  return <Boards boards={boards} />;
}
