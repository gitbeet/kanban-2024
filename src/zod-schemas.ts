import { z } from "zod";

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
    .max(30, { message: "Task name must be at most 30 character long" }),
  createdAt: z.date(),
  updatedAt: z.date(),
  taskId: z.string().uuid({ message: "Task ID must be a uuid" }),
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
    .max(30, { message: "Task name must be at most 30 character long" }),
  createdAt: z.date(),
  updatedAt: z.date(),
  subtasks: z.array(SubtaskSchema),
  columnId: z.string().uuid({ message: "Column ID must be a uuid" }),
  completed: z.boolean(),
});

export const ColumnSchema = z.object({
  id: z.string().uuid({ message: "ID must be a uuid" }),
  index: z.number({ message: "Index must be a number" }),
  name: z
    .string({ message: "Column name must be a string" })
    .trim()
    .min(1, { message: "Cannot be blank" })
    .max(20, { message: "Column name must be at most 20 character long" }),
  createdAt: z.date(),
  updatedAt: z.date(),
  boardId: z.string().uuid({ message: "Board ID must be a uuid" }),
  tasks: z.array(TaskSchema),
});

export const BoardSchema = z.object({
  id: z.string().uuid({ message: "ID must be a uuid" }),
  index: z.number({ message: "Index must be a number" }),
  name: z
    .string({ message: "Board name must be a string" })
    .trim()
    .min(1, { message: "Cannot be blank" })
    .max(20, { message: "Board name must be at most 20 character long" }),
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
