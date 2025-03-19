import { StaticImageData } from "next/image";
import type { db } from "./server/db";
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

export type TransactionType = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];

export type DBType = typeof db;

export type DatabaseType = TransactionType | DBType;

// ----------  CHANGE TYPES BEGINING ----------

export type CreateBoardChange = {
  action: "createBoard";
  name: string;
  id: string;
  oldCurrentBoardId: string;
};

export type RenameBoardChange = {
  action: "renameBoard";
  boardId: string;
  newName: string;
};

export type DeleteBoardChange = {
  action: "deleteBoard";
  boardId: string;
  boardIndex: number;
  wasCurrent: boolean;
};

export type MakeBoardCurrentChange = {
  action: "makeBoardCurrent";
  oldCurrentBoardId: string;
  newCurrentBoardId: string;
};

// Columns
export type CreateColumnChange = {
  action: "createColumn";
  boardId: string;
  columnId: string;
  columnName: string;
};

export type RenameColumnChange = {
  action: "renameColumn";
  columnId: string;
  newName: string;
};

export type DeleteColumnChange = {
  action: "deleteColumn";
  columnId: string;
};

// Tasks
export type CreateTaskChange = {
  action: "createTask";
  columnId: string;
  name: string;
};

export type RenameTaskChange = {
  action: "renameTask";
  taskId: string;
  newTaskName: string;
};

export type DeleteTaskChange = {
  action: "deleteTask";
  taskId: string;
};

export type ToggleTaskCompletedChange = {
  action: "toggleTaskCompleted";
  taskId: string;
};

export type SwitchTaskColumnChange = {
  action: "switchTaskColumn";
  taskId: string;
  oldColumnId: string;
  newColumnId: string;
  oldColumnIndex: number;
  newColumnIndex: number;
};

// Subtasks
export type CreateSubtaskChange = {
  action: "createSubtask";
  newSubtask: SubtaskType;
};

export type RenameSubtaskChange = {
  action: "renameSubtask";
  subtaskId: string;
  newSubtaskName: string;
};

export type DeleteSubtaskChange = {
  action: "deleteSubtask";
  subtaskId: string;
};

export type ToggleSubtaskCompletedChange = {
  action: "toggleSubtaskCompleted";
  subtaskId: string;
};

export type Change =
  // Boards
  | CreateBoardChange
  | RenameBoardChange
  | DeleteBoardChange
  | MakeBoardCurrentChange
  // Columns
  | CreateColumnChange
  | RenameColumnChange
  | DeleteColumnChange
  // Tasks
  | CreateTaskChange
  | RenameTaskChange
  | DeleteTaskChange
  | ToggleTaskCompletedChange
  | SwitchTaskColumnChange
  // Subtasks
  | CreateSubtaskChange
  | RenameSubtaskChange
  | DeleteSubtaskChange
  | ToggleSubtaskCompletedChange;

// ----------  CHANGE TYPES ENDING ----------

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
  | "renameSubtask"
  | "toggleSubtask";

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

// Background

export type ColorBackground = {
  type: "color";
  slug: string;
  title: string;
  value: string;
  alt: string;
};
export type ImageBackground = {
  type: "image";
  slug: string;
  title: string;
  value: StaticImageData;
  alt: string;
};
export type BackgroundType = ColorBackground | ImageBackground;
