import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db/index";
import { boards, columns, tasks } from "./db/schema";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";
import { and, eq, gt, gte, sql } from "drizzle-orm";
import { BoardType, ColumnType, TaskType } from "~/types";

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

  // calculate current max position
  const boardsOrdered = await db.query.boards.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.index),
    limit: 1,
  });
  console.log(boardsOrdered[0]);
  const maxIndex = boardsOrdered[0]?.index ?? 0;

  if (typeof maxIndex === undefined) throw new Error("No max index");

  const newBoard: BoardType = {
    id: uuid(),
    name,
    columns: [],
    userId: user.userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    index: maxIndex + 1,
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

export async function createColumn(boardId: string, columnName: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  // calculate current max position
  const columnsOrdered = await db.query.columns.findMany({
    where: (model, { eq }) => eq(model.boardId, boardId),
    orderBy: (model, { desc }) => desc(model.index),
    limit: 1,
  });

  const maxIndex = columnsOrdered[0]?.index ?? 0;

  if (typeof maxIndex === undefined) throw new Error("No max index");

  const newColumn: ColumnType = {
    id: uuid(),
    index: maxIndex + 1,
    tasks: [],
    name: columnName,
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

  // calculate current max position
  const tasksOrdered = await db.query.tasks.findMany({
    where: (model, { eq }) => eq(model.columnId, columnId),
    orderBy: (model, { desc }) => desc(model.index),
    limit: 1,
  });
  console.log(tasksOrdered[0]);
  const maxIndex = tasksOrdered[0]?.index ?? 0;

  if (typeof maxIndex === undefined) throw new Error("No max index");

  const newTask: TaskType = {
    id: uuid(),
    index: maxIndex + 1,
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
  const task = await db.query.tasks.findFirst({
    where: (model, { eq }) => eq(model.id, taskId),
  });
  if (!task) throw new Error("Task not found");
  await db
    .update(tasks)
    .set({ index: sql`${tasks.index} - 1` })
    .where(and(eq(tasks.columnId, task.columnId), gt(tasks.index, task.index)));
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

export async function switchColumn(
  taskId: string,
  oldColumnId: string,
  newColumnId: string,
  oldColumnIndex: number,
  newColumnIndex: number,
) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  // Check if task belongs to user?

  // Decrement the indicex of the tasks below the switched task in the old column
  await db
    .update(tasks)
    .set({ index: sql`${tasks.index} - 1` })
    .where(
      and(eq(tasks.columnId, oldColumnId), gt(tasks.index, oldColumnIndex)),
    );

  // Increment the indices of the tasks below the switched one in the new column
  await db
    .update(tasks)
    .set({ index: sql`${tasks.index} + 1` })
    .where(
      and(eq(tasks.columnId, newColumnId), gte(tasks.index, newColumnIndex)),
    );
  // Switch the task to the new column and put it in its position (index)
  await db
    .update(tasks)
    .set({ columnId: newColumnId, index: newColumnIndex })
    .where(eq(tasks.id, taskId));

  revalidatePath("/");
}
