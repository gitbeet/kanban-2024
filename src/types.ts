import { type getBoards } from "./server/queries";

export type BoardType = Awaited<ReturnType<typeof getBoards>>[number];
export type ColumnType = Awaited<
  ReturnType<typeof getBoards>
>[number]["columns"][number];
export type TaskType = Awaited<
  ReturnType<typeof getBoards>
>[number]["columns"][number]["tasks"][number];
