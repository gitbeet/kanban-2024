"use server";

import {
  createTask,
  deleteTask,
  renameTask,
  toggleTaskCompleted,
} from "./server/queries";

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
