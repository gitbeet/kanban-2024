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
import type { ColumnType, TaskType } from "./types";
import {
  BoardSchema,
  ColumnSchema,
  SwitchTaskActionSchema,
  TaskSchema,
} from "./zod-schemas";

// ---------- BOARDS ----------

// Not sure if I should use te whole object or just the needed properties to pass to the action

export const createBoardAction = async (
  boardName: unknown,
  boardId: unknown,
) => {
  const result = BoardSchema.pick({ name: true, id: true }).safeParse({
    name: boardName,
    id: boardId,
  });
  if (!result.success) {
    return { error: result.error.issues[0]?.message };
  }
  // Add try/catch in case insert not successful
  await createBoard(boardName as string, boardId as string);
};

export const renameBoardAction = async (
  boardId: unknown,
  newBoardName: unknown,
) => {
  const result = BoardSchema.pick({ id: true, name: true }).safeParse({
    id: boardId,
    name: newBoardName,
  });
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }

  // Add try/catch in case insert not successful

  await renameBoard(boardId as string, newBoardName as string);
};

export const deleteBoardAction = async (
  boardId: unknown,
  boardIndex: unknown,
) => {
  const result = BoardSchema.pick({ id: true, index: true }).safeParse({
    id: boardId,
    index: boardIndex,
  });
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }
  // Add try/catch in case insert not successful

  await deleteBoard(boardId as string, boardIndex as number);
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

export const renameColumnAction = async (
  columnId: unknown,
  newColumnName: unknown,
) => {
  const result = ColumnSchema.pick({ id: true, name: true }).safeParse({
    id: columnId,
    name: newColumnName,
  });
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }

  await renameColumn(columnId as string, newColumnName as string);
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

export const renameTaskAction = async (
  taskId: unknown,
  newTaskName: unknown,
) => {
  const result = TaskSchema.pick({ id: true, name: true }).safeParse({
    id: taskId,
    name: newTaskName,
  });
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }

  await renameTask(taskId as string, newTaskName as string);
};

export const deleteTaskAction = async (taskId: unknown) => {
  const result = TaskSchema.shape.id.safeParse(taskId);
  if (!result.success) {
    console.log(result.error);
    return { error: result.error.issues[0]?.message };
  }
  await deleteTask(taskId as string);
};

export const toggleTaskCompletedAction = async (taskId: unknown) => {
  const result = TaskSchema.shape.id.safeParse(taskId);
  if (!result.success) {
    return { error: result.error.issues[0]?.message };
  }
  await toggleTaskCompleted(taskId as string);
};

// Not sure if its better to pass an object as args or pass args separately
export const switchColumnAction = async (
  taskId: unknown,
  oldColumnId: unknown,
  newColumnId: unknown,
  oldColumnIndex: unknown,
  newColumnIndex: unknown,
) => {
  const args = {
    taskId,
    oldColumnId,
    newColumnId,
    oldColumnIndex: Number(oldColumnIndex),
    newColumnIndex: Number(newColumnIndex),
  };

  const result = SwitchTaskActionSchema.safeParse(args);
  if (!result.success) {
    return { error: result.error.issues[0]?.message };
  }

  await switchColumn(
    taskId as string,
    oldColumnId as string,
    newColumnId as string,
    Number(newColumnIndex),
    Number(oldColumnIndex),
  );
};
