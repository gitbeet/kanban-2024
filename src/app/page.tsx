import Boards from "~/components/boards";
import SubmitButton from "~/components/ui/submit-button";
import { createBoard, getBoards } from "~/server/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const boards = await getBoards();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <form
        action={async (formData: FormData) => {
          "use server";
          const text = formData.get("board-name-input") as string;
          await createBoard(text);
        }}
      >
        <input type="text" name="board-name-input" className="text-black" />
        <SubmitButton text="Create Board" />
      </form>

      <Boards boards={boards} />
    </main>
  );
}
