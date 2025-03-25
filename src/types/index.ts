import type { db } from "../server/db";
import { type Action } from "./actions";
import type {
  backgrounds,
  boards,
  columns,
  subtasks,
  tasks,
} from "~/server/db/schema";

export type BoardType = typeof boards.$inferSelect & { columns: ColumnType[] };

export type ColumnType = typeof columns.$inferSelect & { tasks: TaskType[] };

export type TaskType = typeof tasks.$inferSelect & { subtasks: SubtaskType[] };

export type SubtaskType = typeof subtasks.$inferSelect;

export type UserBackgroundType = typeof backgrounds.$inferSelect;

export type TransactionType = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];

export type DBType = typeof db;

export type DatabaseType = TransactionType | DBType;

export type SetOptimisticType = (update: Action) => void;
