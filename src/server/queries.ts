import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db/index";
import { boards, columns } from "./db/schema";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { BoardType, ColumnType } from "~/types";

// ---------- BOARD ----------

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

export async function createBoard(name: string) {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const newBoard = {
    id: uuid(),
    name,
    userId: user.userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const insertedBoard = await db.insert(boards).values(newBoard);
  revalidatePath("/");
  return insertedBoard;
}

export async function renameBoard(boardId: string, newName: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  await db
    .update(boards)
    .set({ name: newName })
    .where(and(eq(boards.id, boardId), eq(boards.userId, user.userId)));
  revalidatePath("/");
}

export async function deleteBoard(boardId: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  await db
    .delete(boards)
    .where(and(eq(boards.id, boardId), eq(boards.userId, user.userId)));
  revalidatePath("/");
}

// ---------- COLUMN ----------

export async function createColumn(boardId: string, name: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const newColumn = {
    id: uuid(),
    name,
    boardId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const insertedColumn = db.insert(columns).values(newColumn);
  revalidatePath("/");
  return insertedColumn;
}
