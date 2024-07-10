"use server";

import {
  createColumn,
  createTask,
  deleteColumn,
  deleteTask,
  renameColumn,
  renameTask,
  toggleTaskCompleted,
} from "./server/queries";

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
