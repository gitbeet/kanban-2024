import type { db } from "../server/db";
import { type Action } from "./actions";
import type {
  boards,
  columns,
  subtasks,
  tasks,
  userDatas,
} from "~/server/db/schema";

export type BoardType = typeof boards.$inferSelect & { columns: ColumnType[] };

export type ColumnType = typeof columns.$inferSelect & { tasks: TaskType[] };

export type TaskType = typeof tasks.$inferSelect & { subtasks: SubtaskType[] };

export type SubtaskType = typeof subtasks.$inferSelect;

export type TransactionType = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];

export type DBType = typeof db;

export type DatabaseType = TransactionType | DBType;

export type SetOptimisticType = (update: Action) => void;

export type UserDataType = typeof userDatas.$inferSelect;
