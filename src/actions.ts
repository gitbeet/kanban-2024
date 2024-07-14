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
import type { BoardType, ColumnType, TaskType } from "./types";
import { BoardSchema, ColumnSchema, TaskSchema } from "./zod-schemas";

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

export const deleteColumnAction = async (columnId: unknown) => {
  const result = ColumnSchema.shape.id.safeParse(columnId);
  if (!result.success) {
    return { error: result.error.issues[0]?.message };
  }
  await deleteColumn(columnId as string);
};

export const renameColumnAction = async (renamedColumn: unknown) => {
  const result = ColumnSchema.safeParse(renamedColumn);
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }

  const { id: columnId, name: newName } = renamedColumn as ColumnType;
  await renameColumn(columnId, newName);
};

// ---------- TASKS ----------

export const createTaskAction = async (newTask: unknown) => {
  const result = TaskSchema.safeParse(newTask);
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }
  const { columnId: columnId, name: taskName } = newTask as TaskType;

  await createTask(columnId, taskName);
};

export const renameTaskAction = async (renamedTask: unknown) => {
  const result = TaskSchema.safeParse(renamedTask);
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }
  const { id: taskId, name: taskName } = renamedTask as TaskType;

  await renameTask(taskId, taskName);
};

export const deleteTaskAction = async (taskId: unknown) => {
  const result = TaskSchema.shape.id.safeParse(taskId);
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }
  await deleteTask(taskId as string);
};

export const toggleTaskCompletedAction = async (task: unknown) => {
  const result = TaskSchema.safeParse(task);
  if (!result.success) {
    return { error: result.error.issues[0]?.message };
  }
  const { id, completed } = task as TaskType;
  await toggleTaskCompleted(id, !completed);
};

export const switchColumnAction = async (
  taskId: unknown,
  oldColumnId: unknown,
  newColumnId: unknown,
  oldColumnIndex: unknown,
  newColumnIndex: unknown,
) => {
  await switchColumn(
    taskId as string,
    oldColumnId as string,
    newColumnId as string,
    Number(oldColumnIndex),
    Number(newColumnIndex),
  );
};
