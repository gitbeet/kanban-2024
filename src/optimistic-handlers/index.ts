import { createBoard } from "./board/create-board";
import { deleteBoard } from "./board/delete-board";
import { makeBoardCurrent } from "./board/make-board-current";
import { renameBoard } from "./board/rename-board";
import { setInitialBoards } from "./board/set-initial-boards";
import { createColumn } from "./column/create-column";
import { deleteColumn } from "./column/delete-column";
import { renameColumn } from "./column/rename-column";
import { createSubtask } from "./subtask/create-subtask";
import { deleteSubtask } from "./subtask/delete-subtask";
import { renameSubtask } from "./subtask/rename-subtask";
import { toggleSubtask } from "./subtask/toggle-subtask";
import { createTask } from "./task/create-task";
import { deleteTask } from "./task/delete-task";
import { renameTask } from "./task/rename-task";
import { switchTaskColumn } from "./task/switch-task-column";
import { toggleTask } from "./task/toggle-task";
import type { BoardType } from "../types";
import type { Action } from "../types/actions";

export const handleOptimisticUpdate = (state: BoardType[], action: Action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_INITIAL_BOARDS":
      return setInitialBoards(state, payload);
    case "CREATE_BOARD":
      return createBoard(state, payload);
    case "RENAME_BOARD":
      return renameBoard(state, payload);
    case "DELETE_BOARD":
      return deleteBoard(state, payload);
    case "MAKE_BOARD_CURRENT":
      return makeBoardCurrent(state, payload);
    case "CREATE_COLUMN":
      return createColumn(state, payload);
    case "RENAME_COLUMN":
      return renameColumn(state, payload);
    case "DELETE_COLUMN":
      return deleteColumn(state, payload);
    case "CREATE_TASK":
      return createTask(state, payload);
    case "RENAME_TASK":
      return renameTask(state, payload);
    case "DELETE_TASK":
      return deleteTask(state, payload);
    case "TOGGLE_TASK":
      return toggleTask(state, payload);
    case "SWITCH_TASK_COLUMN":
      return switchTaskColumn(state, payload);
    case "CREATE_SUBTASK":
      return createSubtask(state, payload);
    case "RENAME_SUBTASK":
      return renameSubtask(state, payload);
    case "DELETE_SUBTASK":
      return deleteSubtask(state, payload);
    case "TOGGLE_SUBTASK":
      return toggleSubtask(state, payload);
    default:
      break;
  }
  return state;
};
