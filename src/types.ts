import { type getBoards } from "./server/queries";

export type BoardType = Awaited<ReturnType<typeof getBoards>>[number];
export type ColumnType = Awaited<
  ReturnType<typeof getBoards>
>[number]["columns"][number];
export type TaskType = Awaited<
  ReturnType<typeof getBoards>
>[number]["columns"][number]["tasks"][number];

export type SetOptimisticType = (action: {
  action:
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
  board?: BoardType;
  column?: ColumnType;
  task?: TaskType;
  oldColumnId?: string;
  newColumnId?: string;
  newColumnIndex?: number;
  taskId?: string;
  columnId?: string;
  taskIndex?: string;
}) => void;
