import { type getBoards } from "./server/queries";

export type BoardType = Awaited<ReturnType<typeof getBoards>>[number];
export type ColumnType = Awaited<
  ReturnType<typeof getBoards>
>[number]["columns"][number];
export type TaskType = Awaited<
  ReturnType<typeof getBoards>
>[number]["columns"][number]["tasks"][number];

export type OptimisticActionType =
  | "createBoard"
  | "renameBoard"
  | "deleteBoard"
  | "createColumn"
  | "renameColumn"
  | "deleteColumn"
  | "createTask"
  | "renameTask"
  | "deleteTask"
  | "toggleTask"
  | "switchTaskColumn";

export type OptimisticParams = {
  action: OptimisticActionType;
  board?: BoardType;
  column?: ColumnType;
  task?: TaskType;
  oldColumnId?: string;
  newColumnId?: string;
  newColumnIndex?: number;
  taskId?: string;
  columnId?: string;
  taskIndex?: string;
};

export type SetOptimisticType = (args: OptimisticParams) => void;
