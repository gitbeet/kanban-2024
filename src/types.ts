import { type getBoards } from "./server/queries";

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

export type OptimisticActionType =
  | "getInitialBoards"
  | "createBoard"
  | "renameBoard"
  | "deleteBoard"
  | "makeBoardCurrent"
  | "createColumn"
  | "renameColumn"
  | "deleteColumn"
  | "createTask"
  | "renameTask"
  | "deleteTask"
  | "toggleTask"
  | "switchTaskColumn"
  | "createSubtask"
  | "deleteSubtask"
  | "renameSubtask";

export type OptimisticParams = {
  action: OptimisticActionType;
  board?: BoardType;
  boardId?: string;
  newBoardName?: string;
  newColumnName?: string;
  boards?: BoardType[];
  column?: ColumnType;
  task?: TaskType;
  columnId?: string;
  taskId?: string;
  newTaskName?: string;
  subtask?: SubtaskType;
  subtaskId?: string;
  newSubtaskName?: string;
  oldColumnId?: string;
  newColumnId?: string;
  newColumnIndex?: number;
  oldColumnIndex?: number;
};

export type SetOptimisticType = (args: OptimisticParams) => void;
