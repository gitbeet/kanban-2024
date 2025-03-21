import { BoardType, ColumnType, SubtaskType, TaskType } from ".";
//  ----- Boards -----
export type CreateBoardAction = {
  type: "CREATE_BOARD";
  payload: { board: BoardType };
};
export type RenameBoardAction = {
  type: "RENAME_BOARD";
  payload: { boardId: string; newBoardName: string };
};
export type DeleteBoardAction = {
  type: "DELETE_BOARD";
  payload: { boardId: string; boardIndex: number; wasCurrent: boolean };
};
export type MakeBoardCurrentAction = {
  type: "MAKE_BOARD_CURRENT";
  payload: { oldCurrentBoardId: string; newCurrentBoardId: string };
};

export type BoardAction =
  | CreateBoardAction
  | RenameBoardAction
  | DeleteBoardAction
  | MakeBoardCurrentAction;

//  ----- Columns -----

export type CreateColumnAction = {
  type: "CREATE_COLUMN";
  payload: { column: ColumnType };
};
export type RenameColumnAction = {
  type: "RENAME_COLUMN";
  payload: { boardId: string; columnId: string; newColumnName: string };
};
export type DeleteColumnAction = {
  type: "DELETE_COLUMN";
  payload: { boardId: string; columnId: string };
};

export type ColumnAction =
  | CreateColumnAction
  | RenameColumnAction
  | DeleteColumnAction;

//  ----- Tasks -----

export type CreateTaskAction = {
  type: "CREATE_TASK";
  payload: { boardId: string; columnId: string; task: TaskType };
};
export type RenameTaskAction = {
  type: "RENAME_TASK";
  payload: {
    boardId: string;
    columnId: string;
    taskId: string;
    newTaskName: string;
  };
};
export type DeleteTaskAction = {
  type: "DELETE_TASK";
  payload: { boardId: string; columnId: string; taskId: string };
};
export type ToggleTaskAction = {
  type: "TOGGLE_TASK";
  payload: { boardId: string; columnId: string; taskId: string };
};
export type SwitchTaskColumnAction = {
  type: "SWITCH_TASK_COLUMN";
  payload: {
    boardId: string;
    taskId: string;
    oldColumnId: string;
    newColumnId: string;
    oldColumnIndex: number;
    newColumnIndex: number;
  };
};
export type TaskAction =
  | CreateTaskAction
  | RenameTaskAction
  | DeleteTaskAction
  | ToggleTaskAction
  | SwitchTaskColumnAction;

//  ----- Subtasks -----

export type CreateSubtaskAction = {
  type: "CREATE_SUBTASK";
  payload: {
    boardId: string;
    columnId: string;
    taskId: string;
    subtask: SubtaskType;
  };
};
export type RenameSubtaskAction = {
  type: "RENAME_SUBTASK";
  payload: {
    boardId: string;
    columnId: string;
    taskId: string;
    subtaskId: string;
    newSubtaskName: string;
  };
};
export type DeleteSubtaskAction = {
  type: "DELETE_SUBTASK";
  payload: {
    boardId: string;
    columnId: string;
    taskId: string;
    subtaskId: string;
  };
};
export type ToggleSubtaskAction = {
  type: "TOGGLE_SUBTASK";
  payload: {
    boardId: string;
    columnId: string;
    taskId: string;
    subtaskId: string;
  };
};

export type SubaskAction =
  | CreateSubtaskAction
  | RenameSubtaskAction
  | DeleteSubtaskAction
  | ToggleSubtaskAction;

export type Action = BoardAction | ColumnAction | TaskAction | SubaskAction;
