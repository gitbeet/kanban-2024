import { z } from "zod";

export const UserDataSchema = z.object({
  id: z.string().uuid({ message: "ID must be a uuid" }),
  userId: z.string(),
  currentBoardId: z.string(),
  currentBackgroundId: z.string(),
  backgroundOpacity: z.number().int(),
  backgroundBlur: z.number().int(),
  performanceMode: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserBackgroundSchema = z.object({
  id: z.string().uuid({ message: "ID must be a uuid" }),
  createdAt: z.date(),
  userId: z.string(),
  fileUrl: z.string(),
  fileKey: z.string(),
});

export const SubtaskSchema = z.object({
  id: z.string().uuid({ message: "ID must be a uuid" }),
  index: z
    .number({ message: "Index must be a number" })
    .int({ message: "Index must be a integer" })
    .positive({ message: "Index must be a positive number" }),
  name: z
    .string({ message: "Task name must be a string" })
    .trim()
    .min(1, { message: "Cannot be blank" })
    .max(30, { message: "Subtask name too long" }),
  createdAt: z.date(),
  updatedAt: z.date(),
  taskId: z.string().uuid({ message: "Subtask ID must be a uuid" }),
  completed: z.boolean(),
});

export const TaskSchema = z.object({
  id: z.string().uuid({ message: "ID must be a uuid" }),
  index: z
    .number({ message: "Index must be a number" })
    .int({ message: "Index must be a integer" })
    .positive({ message: "Index must be a positive number" }),
  name: z
    .string({ message: "Task name must be a string" })
    .trim()
    .min(1, { message: "Cannot be blank" })
    .max(50, { message: "Task name too long" }),
  createdAt: z.date(),
  updatedAt: z.date(),
  subtasks: z.array(SubtaskSchema),
  columnId: z.string().uuid({ message: "Task ID must be a uuid" }),
  completed: z.boolean(),
});

export const ColumnSchema = z.object({
  id: z.string().uuid({ message: "ID must be a uuid" }),
  index: z.number({ message: "Index must be a number" }),
  name: z
    .string({ message: "Column name must be a string" })
    .trim()
    .min(1, { message: "Cannot be blank" })
    .max(30, { message: "Column name too long" }),
  createdAt: z.date(),
  updatedAt: z.date(),
  boardId: z.string().uuid({ message: "Column ID must be a uuid" }),
  tasks: z.array(TaskSchema),
});

export const BoardSchema = z.object({
  id: z.string().uuid({ message: "ID must be a uuid" }),
  index: z.number({ message: "Index must be a number" }),
  name: z
    .string({ message: "Board name must be a string" })
    .trim()
    .min(1, { message: "Cannot be blank" })
    .max(20, { message: "Board name too long" }),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  columns: z.array(ColumnSchema),
  current: z.boolean(),
});

export const SwitchTaskActionSchema = z.object({
  taskId: z.string().uuid(),
  oldColumnId: z.string().uuid(),
  newColumnId: z.string().uuid(),
  oldColumnIndex: z.number().int().positive(),
  newColumnIndex: z.number().int().positive(),
});
