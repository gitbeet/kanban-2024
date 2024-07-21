import "server-only";

import { db } from "./db/index";
import { auth } from "@clerk/nextjs/server";
import { boards, columns, subtasks, tasks } from "./db/schema";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";
import { and, eq, gt, gte, lt, lte, ne, sql } from "drizzle-orm";
import type { BoardType, ColumnType, SubtaskType, TaskType } from "~/types";

// ---------- BOARD ----------

export async function getBoards() {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const boards = await db.query.boards.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    with: {
      columns: {
        with: {
          tasks: {
            with: {
              subtasks: true,
            },
          },
        },
      },
    },
  });
  return boards;
}

export async function createBoard(
  name: string,
  id: string,
  oldCurrentBoardId: string,
) {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  // calculate current max position
  const boardsOrdered = await db.query.boards.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.index),
    limit: 1,
  });
  const maxIndex = boardsOrdered[0]?.index ?? 0;

  if (typeof maxIndex === undefined) throw new Error("No max index");

  const newBoard: BoardType = {
    id,
    name,
    columns: [],
    current: true,
    userId: user.userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    index: maxIndex + 1,
  };

  await db
    .update(boards)
    .set({ current: false })
    .where(
      and(eq(boards.id, oldCurrentBoardId), eq(boards.userId, user.userId)),
    );
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

export async function deleteBoard(
  boardId: string,
  boardIndex: number,
  wasCurrent: boolean,
) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  await db
    .update(boards)
    .set({ index: sql`${boards.index} - 1` })
    .where(and(gt(boards.index, boardIndex), eq(boards.userId, user.userId)));
  await db
    .delete(boards)
    .where(and(eq(boards.id, boardId), eq(boards.userId, user.userId)));
  if (!wasCurrent) return revalidatePath("/");
  await db
    .update(boards)
    .set({ current: true })
    .where(and(eq(boards.index, 1), eq(boards.userId, user.userId)));
  revalidatePath("/");
}

export async function makeBoardCurrent(
  oldCurrentBoardId: string,
  newCurrentBoardId: string,
) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  await db
    .update(boards)
    .set({ current: false, updatedAt: new Date() })
    .where(
      and(eq(boards.id, oldCurrentBoardId), eq(boards.userId, user.userId)),
    );
  await db
    .update(boards)
    .set({ current: true })
    .where(
      and(eq(boards.id, newCurrentBoardId), eq(boards.userId, user.userId)),
    );

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
  const maxIndex = tasksOrdered[0]?.index ?? 0;

  if (typeof maxIndex === undefined) throw new Error("No max index");

  const newTask: TaskType = {
    id: uuid(),
    index: maxIndex + 1,
    name,
    completed: false,
    columnId,
    subtasks: [],
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

export async function toggleTaskCompleted(taskId: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  // Check if task belongs to user?

  const task = await db.query.tasks.findFirst({
    where: (model, { eq }) => eq(model.id, taskId),
  });

  if (!task) throw new Error("Task not found!");

  await db
    .update(tasks)
    .set({ completed: !task.completed, updatedAt: new Date() })
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

  // check if we are not moving the task at all

  // check if we are dragging the task to the same column
  const inTheSameColumn = oldColumnId === newColumnId;
  if (inTheSameColumn) {
    // check which direction we're moving in
    const movingUp = oldColumnIndex > newColumnIndex;
    if (movingUp) {
      try {
        // update the task index
        await db
          .update(tasks)
          .set({ index: newColumnIndex, updatedAt: new Date() })
          .where(eq(tasks.id, taskId));
        // Increment all indices between the old and the new, excluding the dragged task's index
        await db
          .update(tasks)
          .set({ index: sql`${tasks.index} + 1` })
          .where(
            and(
              eq(tasks.columnId, newColumnId),
              ne(tasks.id, taskId),
              gte(tasks.index, newColumnIndex),
              lte(tasks.index, oldColumnIndex),
            ),
          );
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        // update the task index
        await db
          .update(tasks)
          .set({ index: newColumnIndex - 1, updatedAt: new Date() })
          .where(eq(tasks.id, taskId));
        // Decrement all indices between the old and the new, excluding the dragged task's index
        await db
          .update(tasks)
          .set({ index: sql`${tasks.index} - 1` })
          .where(
            and(
              eq(tasks.columnId, newColumnId),
              ne(tasks.id, taskId),
              gte(tasks.index, oldColumnIndex),
              lt(tasks.index, newColumnIndex),
            ),
          );
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    // When we are dragging the task to a different column
    try {
      await db
        .update(tasks)
        .set({ index: sql`${tasks.index} - 1` })
        .where(
          and(
            eq(tasks.columnId, oldColumnId),
            gte(tasks.index, oldColumnIndex),
          ),
        );
      await db
        .update(tasks)
        .set({ index: sql`${tasks.index} + 1` })
        .where(
          and(
            eq(tasks.columnId, newColumnId),
            gte(tasks.index, newColumnIndex),
          ),
        );

      await db
        .update(tasks)
        .set({ columnId: newColumnId, index: newColumnIndex })
        .where(eq(tasks.id, taskId));
    } catch (error) {
      console.log(error);
    }
  }

  revalidatePath("/");
}

// Subtasks

export async function createSubtask(taskId: string, name: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  // Check if task belongs to user?

  // calculate current max position
  const subtasksOrdered = await db.query.subtasks.findMany({
    where: (model, { eq }) => eq(model.taskId, taskId),
    orderBy: (model, { desc }) => desc(model.index),
    limit: 1,
  });
  const maxIndex = subtasksOrdered[0]?.index ?? 0;

  if (typeof maxIndex === undefined) throw new Error("No max index");

  const newSubtask: SubtaskType = {
    id: uuid(),
    index: maxIndex + 1,
    name,
    completed: false,
    taskId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(subtasks).values(newSubtask);
  revalidatePath("/");
  return newSubtask;
}

export async function deleteSubtask(subtaskId: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  // Check if task belongs to user?
  const subtask = await db.query.subtasks.findFirst({
    where: (model, { eq }) => eq(model.id, subtaskId),
  });
  if (!subtask) throw new Error("Subtask not found");
  await db
    .update(subtasks)
    .set({ index: sql`${subtasks.index} - 1` })
    .where(
      and(
        eq(subtasks.taskId, subtask.taskId),
        gt(subtasks.index, subtask.index),
      ),
    );
  await db.delete(subtasks).where(eq(subtasks.id, subtaskId));
  revalidatePath("/");
}

export async function renameSubtask(subtaskId: string, newName: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  // Check if subtask belongs to user?
  await db
    .update(subtasks)
    .set({ name: newName, updatedAt: new Date() })
    .where(eq(subtasks.id, subtaskId));
  revalidatePath("/");
}
