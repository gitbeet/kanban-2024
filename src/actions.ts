"use server";

import { z } from "zod";
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
import { BoardSchema } from "./zod-schemas";

// ---------- BOARDS ----------

export const createBoardAction = async (boardName: unknown) => {
  const BoardNameSchema = BoardSchema.shape.name;
  const result = BoardNameSchema.safeParse(boardName);
  if (!result.success) {
    return { error: result.error.issues[0]?.message };
  }
  await createBoard(boardName as string);
};

export const renameBoardAction = async (formData: FormData) => {
  const newName = formData.get("board-name-input") as string;
  const boardId = formData.get("board-id") as string;
  await renameBoard(boardId, newName);
};

export const deleteBoardAction = async (formData: FormData) => {
  const boardId = formData.get("board-id") as string;
  await deleteBoard(boardId);
};

// ---------- COLUMNS ----------

export const createColumnAction = async (formData: FormData) => {
  const boardId = formData.get("board-id") as string;
  const columnName = formData.get("column-name-input") as string;
  await createColumn(boardId, columnName);
};

export const deleteColumnAction = async (formData: FormData) => {
  const columnId = formData.get("column-id") as string;
  await deleteColumn(columnId);
};

export const renameColumnAction = async (formData: FormData) => {
  const columnId = formData.get("column-id") as string;
  const newName = formData.get("column-name-input") as string;
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
