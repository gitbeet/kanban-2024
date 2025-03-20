import type { db } from "../server/db";
import { type getBoards } from "../server/queries";
import { Update } from "./updates";

export type BoardType = Awaited<ReturnType<typeof getBoards>>[number];

export type ColumnType = Awaited<
  ReturnType<typeof getBoards>
>[number]["columns"][number];

export type TaskType = Awaited<
  ReturnType<typeof getBoards>
>[number]["columns"][number]["tasks"][number];

export type SubtaskType = Awaited<
  ReturnType<typeof getBoards>
>[number]["columns"][number]["tasks"][number]["subtasks"][number];

export type TransactionType = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];

export type DBType = typeof db;

export type DatabaseType = TransactionType | DBType;

export type SetOptimisticType = (update: Update) => void;
