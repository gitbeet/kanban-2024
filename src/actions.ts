"use server";

import {
  createBoard,
  createColumn,
  createTask,
  deleteBoard,
  deleteColumn,
  deleteTask,
  renameBoard,
  renameColumn,
  renameTask,
  switchColumn,
  toggleTaskCompleted,
} from "./server/queries";
import type { BoardType, ColumnType } from "./types";
import { BoardSchema, ColumnSchema } from "./zod-schemas";

// ---------- BOARDS ----------

// Not sure if I should use te whole object or just the needed properties to pass to the action

export const createBoardAction = async (boardName: unknown) => {
  const BoardNameSchema = BoardSchema.shape.name;
  const result = BoardNameSchema.safeParse(boardName);
  if (!result.success) {
    return { error: result.error.issues[0]?.message };
  }
  // Add try/catch in case insert not successful
  await createBoard(boardName as string);
};

export const renameBoardAction = async (renamedBoard: unknown) => {
  const result = BoardSchema.safeParse(renamedBoard);
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }

  const { id, name } = renamedBoard as BoardType;
  // Add try/catch in case insert not successful

  await renameBoard(id, name);
};

export const deleteBoardAction = async (boardId: unknown) => {
  const result = BoardSchema.shape.id.safeParse(boardId);
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }
  // Add try/catch in case insert not successful

  await deleteBoard(boardId as string);
};

// ---------- COLUMNS ----------

export const createColumnAction = async (newColumn: unknown) => {
  const result = ColumnSchema.safeParse(newColumn);
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }

  const { boardId, name: columnName } = newColumn as ColumnType;
  // Add try/catch in case insert not successful

  await createColumn(boardId, columnName);
};

export const deleteColumnAction = async (formData: FormData) => {
  const columnId = formData.get("column-id") as string;
  await deleteColumn(columnId);
};

export const renameColumnAction = async (renamedColumn: unknown) => {
  const result = ColumnSchema.safeParse(renamedColumn);
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }

  const { id: columnId, name: newName } = renamedColumn as BoardType;
  await renameColumn(columnId, newName);
};

// ---------- TASKS ----------

export const createTaskAction = async (formData: FormData) => {
  const columnId = formData.get("column-id") as string;
  const taskName = formData.get("task-name-input") as string;
  await createTask(columnId, taskName);
};

export const renameTaskAction = async (formData: FormData) => {
  const taskName = formData.get("task-name-input") as string;
  const taskId = formData.get("task-id") as string;
  await renameTask(taskId, taskName);
};

export const deleteTaskAction = async (formData: FormData) => {
  const taskId = formData.get("task-id") as string;
  await deleteTask(taskId);
};

export const toggleTaskCompletedAction = async (formData: FormData) => {
  const taskId = formData.get("task-id") as string;
  const taskCompleted = formData.get("task-completed") as string;
  await toggleTaskCompleted(taskId, taskCompleted === "true" ? false : true);
};

export const switchColumnAction = async (formData: FormData) => {
  const taskId = formData.get("task-id") as string;
  const oldColumnId = formData.get("old-column-id") as string;
  const newColumnId = formData.get("new-column-id") as string;
  const oldColumnIndex = formData.get("old-column-index") as string;
  const newColumnIndex = formData.get("new-column-index") as string;
  await switchColumn(
    taskId,
    oldColumnId,
    newColumnId,
    Number(oldColumnIndex),
    Number(newColumnIndex),
  );
};
