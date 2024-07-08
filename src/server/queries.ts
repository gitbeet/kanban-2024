import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db/index";
import { boards, columns, tasks } from "./db/schema";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

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
    .set({ name: newName, updatedAt: new Date() })
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

export async function renameColumn(columnId: string, newName: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  // Check if col belongs to user ?
  await db
    .update(columns)
    .set({ name: newName, updatedAt: new Date() })
    .where(and(eq(columns.id, columnId)));

  revalidatePath("/");
}

export async function deleteColumn(columnId: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  // Check if col belongs to user?
  await db.delete(columns).where(eq(columns.id, columnId));
  revalidatePath("/");
}

// ---------- TASK ----------

export async function createTask(columnId: string, name: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  // Check if task belongs to user?
  const newTask = {
    id: uuid(),
    name,
    completed: false,
    columnId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(tasks).values(newTask);
  revalidatePath("/");
  return newTask;
}

export async function renameTask(taskId: string, newName: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  // Check if task belongs to user?
  await db
    .update(tasks)
    .set({ name: newName, updatedAt: new Date() })
    .where(eq(tasks.id, taskId));
  revalidatePath("/");
}

export async function deleteTask(taskId: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  // Check if task belongs to user?
  await db.delete(tasks).where(eq(tasks.id, taskId));
  revalidatePath("/");
}

export async function toggleTaskCompleted(taskId: string, completed: boolean) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  // Check if task belongs to user?
  await db
    .update(tasks)
    .set({ completed, updatedAt: new Date() })
    .where(eq(tasks.id, taskId));
  revalidatePath("/");
}
