import { BoardType, ColumnType, SubtaskType, TaskType } from ".";
//  ----- Boards -----
export type CreateBoardUpdate = {
  action: "createBoard";
  payload: { board: BoardType };
};
export type RenameBoardUpdate = {
  action: "renameBoard";
  payload: { boardId: string; newBoardName: string };
};
export type DeleteBoardUpdate = {
  action: "deleteBoard";
  payload: { boardId: string; boardIndex: number; wasCurrent: boolean };
};
export type MakeBoardCurrentUpdate = {
  action: "makeBoardCurrent";
  payload: { oldCurrentBoardId: string; newCurrentBoardId: string };
};

export type BoardUpdate =
  | CreateBoardUpdate
  | RenameBoardUpdate
  | DeleteBoardUpdate
  | MakeBoardCurrentUpdate;

//  ----- Columns -----

export type CreateColumnUpdate = {
  action: "createColumn";
  payload: { column: ColumnType };
};
export type RenameColumnUpdate = {
  action: "renameColumn";
  payload: { boardId: string; columnId: string; newColumnName: string };
};
export type DeleteColumnUpdate = {
  action: "deleteColumn";
  payload: { boardId: string; columnId: string };
};

export type ColumnUpdate =
  | CreateColumnUpdate
  | RenameColumnUpdate
  | DeleteColumnUpdate;

//  ----- Tasks -----

export type CreateTaskUpdate = {
  action: "createTask";
  payload: { boardId: string; columnId: string; task: TaskType };
};
export type RenameTaskUpdate = {
  action: "renameTask";
  payload: {
    boardId: string;
    columnId: string;
    taskId: string;
    newTaskName: string;
  };
};
export type DeleteTaskUpdate = {
  action: "deleteTask";
  payload: { boardId: string; columnId: string; taskId: string };
};
export type ToggleTaskUpdate = {
  action: "toggleTask";
  payload: { boardId: string; columnId: string; taskId: string };
};
export type SwitchTaskColumnUpdate = {
  action: "switchTaskColumn";
  payload: {
    boardId: string;
    taskId: string;
    oldColumnId: string;
    newColumnId: string;
    oldColumnIndex: number;
    newColumnIndex: number;
  };
};
export type TaskUpdate =
  | CreateTaskUpdate
  | RenameTaskUpdate
  | DeleteTaskUpdate
  | ToggleTaskUpdate
  | SwitchTaskColumnUpdate;

//  ----- Subtasks -----

export type CreateSubtaskUpdate = {
  action: "createSubtask";
  payload: {
    boardId: string;
    columnId: string;
    taskId: string;
    subtask: SubtaskType;
  };
};
export type RenameSubtaskUpdate = {
  action: "renameSubtask";
  payload: {
    boardId: string;
    columnId: string;
    taskId: string;
    subtaskId: string;
    newSubtaskName: string;
  };
};
export type DeleteSubtaskUpdate = {
  action: "deleteSubtask";
  payload: {
    boardId: string;
    columnId: string;
    taskId: string;
    subtaskId: string;
  };
};
export type ToggleSubtaskUpdate = {
  action: "toggleSubtask";
  payload: {
    boardId: string;
    columnId: string;
    taskId: string;
    subtaskId: string;
  };
};

export type SubaskUpdate =
  | CreateSubtaskUpdate
  | RenameSubtaskUpdate
  | DeleteSubtaskUpdate
  | ToggleSubtaskUpdate;

export type Update = BoardUpdate | ColumnUpdate | TaskUpdate | SubaskUpdate;
