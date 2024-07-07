import { auth } from "@clerk/nextjs/server";
import { db } from "./db/index";

export async function getBoards() {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const boards = await db.query.boards.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    with: {
      columns: {
        with: {
          tasks: true,
        },
      },
    },
  });
  return boards;
}
