import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string().uuid({ message: "ID must be a uuid" }),
  index: z.number({ message: "Index must be a number" }),
  name: z
    .string({ message: "Task name must be a string" })
    .min(1, { message: "Cannot be blank" })
    .max(100, { message: "Task name must be at most 100 character long" })
    .trim(),
  createdAt: z.date(),
  updatedAt: z.date(),
  columnId: z.string().uuid({ message: "Column ID must be a uuid" }),
});

export const ColumnSchema = z.object({
  id: z.string().uuid({ message: "ID must be a uuid" }),
  index: z.number({ message: "Index must be a number" }),
  name: z
    .string({ message: "Column name must be a string" })
    .min(1, { message: "Cannot be blank" })
    .max(20, { message: "Column name must be at most 20 character long" })
    .trim(),
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
    .min(1, { message: "Cannot be blank" })
    .max(20, { message: "Board name must be at most 20 character long" })
    .trim(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  columns: z.array(ColumnSchema),
});
