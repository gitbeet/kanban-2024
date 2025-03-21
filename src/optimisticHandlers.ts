/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TaskType, BoardType, SubtaskType } from "./types";
import {
  CreateBoardAction,
  CreateColumnAction,
  CreateSubtaskAction,
  CreateTaskAction,
  DeleteBoardAction,
  DeleteColumnAction,
  DeleteSubtaskAction,
  DeleteTaskAction,
  MakeBoardCurrentAction,
  RenameBoardAction,
  RenameColumnAction,
  RenameSubtaskAction,
  RenameTaskAction,
  SwitchTaskColumnAction,
  ToggleSubtaskAction,
  ToggleTaskAction,
  Action,
} from "./types/actions";

// Boards

const createBoard = (
  state: BoardType[],
  payload: CreateBoardAction["payload"],
) => {
  const { board } = payload;
  const allfalse = state.map((b) => ({ ...b, current: false }));
  return [...allfalse, board];
};

const renameBoard = (
  state: BoardType[],
  payload: RenameBoardAction["payload"],
) => {
  const { boardId, newBoardName } = payload;
  if (!boardId || !newBoardName) return state;
  return state.map((b) =>
    b.id === boardId ? { ...b, name: newBoardName, updatedAt: new Date() } : b,
  );
};

const deleteBoard = (
  state: BoardType[],
  payload: DeleteBoardAction["payload"],
) => {
  const { boardId, wasCurrent } = payload;
  const board = state.find((board) => board.id === boardId);
  if (!board || !boardId) return state;
  let updatedBoards = state
    // filter the deleted board
    .filter((b) => b.id !== boardId)
    // decrement the index of the tasks below
    .map((b) =>
      b.index > board?.index
        ? { ...b, index: b.index - 1, updatedAt: new Date() }
        : b,
    );
  // If the deleted board was current , set the first board as current else nothing
  if (wasCurrent) {
    updatedBoards = updatedBoards.map((b, i) =>
      i === 0 ? { ...b, current: true } : { ...b, current: false },
    );
  }
  return updatedBoards;
};

const makeBoardCurrent = (
  state: BoardType[],
  payload: MakeBoardCurrentAction["payload"],
) => {
  const { newCurrentBoardId } = payload;
  return state
    .map((b) => ({ ...b, current: false }))
    .map((b) =>
      b.id === newCurrentBoardId
        ? { ...b, current: true, updatedAt: new Date() }
        : b,
    );
};

// Columns
const createColumn = (
  state: BoardType[],
  payload: CreateColumnAction["payload"],
) => {
  const { column } = payload;
  return state.map((b) =>
    b.id === column.boardId ? { ...b, columns: [...b.columns, column] } : b,
  );
};

const renameColumn = (
  state: BoardType[],
  payload: RenameColumnAction["payload"],
) => {
  const { boardId, columnId, newColumnName } = payload;
  return state.map((b) =>
    b.id === boardId
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === columnId ? { ...c, name: newColumnName } : c,
          ),
        }
      : b,
  );
};

const deleteColumn = (
  state: BoardType[],
  payload: DeleteColumnAction["payload"],
) => {
  const { boardId, columnId } = payload;
  return state.map((b) =>
    b.id === boardId
      ? { ...b, columns: b.columns.filter((c) => c.id !== columnId) }
      : b,
  );
};

// Tasks
const createTask = (
  state: BoardType[],
  payload: CreateTaskAction["payload"],
) => {
  const { boardId, columnId, task } = payload;
  return state.map((b) =>
    b.id === boardId
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === columnId ? { ...c, tasks: [...c.tasks, task] } : c,
          ),
        }
      : b,
  );
};

const renameTask = (
  state: BoardType[],
  payload: RenameTaskAction["payload"],
) => {
  const { boardId, columnId, newTaskName, taskId } = payload;
  return state.map((b) =>
    b.id === boardId
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === columnId
              ? {
                  ...c,
                  tasks: c.tasks.map((t) =>
                    t.id === taskId
                      ? { ...t, name: newTaskName, updatedAt: new Date() }
                      : t,
                  ),
                }
              : c,
          ),
        }
      : b,
  );
};

const deleteTask = (
  state: BoardType[],
  payload: DeleteTaskAction["payload"],
) => {
  const { boardId, columnId, taskId } = payload;
  return state.map((b) =>
    b.id === boardId
      ? {
          ...b,
          columns: b.columns.map((c) => {
            if (c.id === columnId) {
              const currentTaskIndex = c.tasks.find(
                (t) => t.id === taskId,
              )?.index;
              if (!currentTaskIndex) return c;
              return {
                ...c,
                tasks: c.tasks
                  .filter((t) => t.id !== taskId)
                  .map((t) =>
                    t.index > currentTaskIndex
                      ? { ...t, index: t.index - 1 }
                      : t,
                  ),
              };
            } else {
              return c;
            }
          }),
        }
      : b,
  );
};

const toggleTask = (
  state: BoardType[],
  payload: ToggleTaskAction["payload"],
) => {
  const { boardId, columnId, taskId } = payload;
  return state.map((b) =>
    b.id === boardId
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === columnId
              ? {
                  ...c,
                  tasks: c.tasks.map((t) =>
                    t.id === taskId ? { ...t, completed: !t.completed } : t,
                  ),
                }
              : c,
          ),
        }
      : b,
  );
};

const switchTaskColumn = (
  state: BoardType[],
  payload: SwitchTaskColumnAction["payload"],
) => {
  const {
    boardId,
    newColumnId,
    newColumnIndex,
    oldColumnId,
    oldColumnIndex,
    taskId,
  } = payload;
  const currentBoard = state.find((b) => b.id === boardId);
  const currentColumn = currentBoard?.columns.find(
    (col) => col.id === oldColumnId,
  );
  const currentTask = currentColumn?.tasks.find((task) => task.id === taskId);
  if (!currentTask) return state;

  if (oldColumnId === newColumnId) {
    return state.map((b) => {
      return b.id === boardId
        ? {
            ...b,
            columns: b.columns.map((c) => {
              return c.id === oldColumnId
                ? {
                    ...c,
                    tasks: c.tasks.map((t) => {
                      if (t.id === taskId) {
                        return { ...t, index: newColumnIndex };
                      } else if (t.index >= newColumnIndex) {
                        return { ...t, index: t.index + 1 };
                      } else {
                        return t;
                      }
                    }),
                  }
                : c;
            }),
          }
        : b;
    });
  }

  return state.map((b) => {
    if (b.id !== boardId) return b;

    return {
      ...b,
      columns: b.columns.map((c) => {
        if (c.id === oldColumnId) {
          return {
            ...c,
            tasks: c.tasks
              .map((t) =>
                t.index > oldColumnIndex ? { ...t, index: t.index - 1 } : t,
              )
              .filter((t) => t.id !== taskId),
          };
        } else if (c.id === newColumnId) {
          const newTask: TaskType = {
            ...currentTask,
            index: newColumnIndex - 1,
            updatedAt: new Date(),
          };
          const newTasks = [...c.tasks];
          newTasks.splice(newColumnIndex, 0, newTask);
          return {
            ...c,
            tasks: newTasks.map((t) =>
              t.index > newColumnIndex ? { ...t, index: t.index + 1 } : t,
            ),
          };
        }
        return c;
      }),
    };
  });
};

// Subtasks

const createSubtask = (
  state: BoardType[],
  payload: CreateSubtaskAction["payload"],
) => {
  const { boardId, columnId, subtask, taskId } = payload;
  return state.map((b) =>
    b.id === boardId
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === columnId
              ? {
                  ...c,
                  tasks: c.tasks.map((task) =>
                    task.id === taskId
                      ? { ...task, subtasks: [...task.subtasks, subtask] }
                      : task,
                  ),
                }
              : c,
          ),
        }
      : b,
  );
};

const renameSubtask = (
  state: BoardType[],
  payload: RenameSubtaskAction["payload"],
) => {
  const { boardId, columnId, newSubtaskName, subtaskId, taskId } = payload;
  return state.map((b) =>
    b.id === boardId
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === columnId
              ? {
                  ...c,
                  tasks: c.tasks.map((t) =>
                    t.id === taskId
                      ? {
                          ...t,
                          subtasks: t.subtasks.map((s) =>
                            s.id === subtaskId
                              ? {
                                  ...s,
                                  name: newSubtaskName,
                                  updatedAt: new Date(),
                                }
                              : s,
                          ),
                        }
                      : t,
                  ),
                }
              : c,
          ),
        }
      : b,
  );
};

const deleteSubtask = (
  state: BoardType[],
  payload: DeleteSubtaskAction["payload"],
) => {
  const { boardId, columnId, subtaskId, taskId } = payload;
  return state.map((b) =>
    b.id === boardId
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === columnId
              ? {
                  ...c,
                  tasks: c.tasks.map((t) => {
                    if (t.id === taskId) {
                      const currentSubtaskIndex = t.subtasks.find(
                        (s) => s.id === subtaskId,
                      )?.index;
                      if (!currentSubtaskIndex) return t;
                      return {
                        ...t,
                        subtasks: t.subtasks
                          .filter((s) => s.id !== subtaskId)
                          .map((s) =>
                            s.index > currentSubtaskIndex
                              ? { ...s, index: s.index - 1 }
                              : s,
                          ),
                      };
                    } else {
                      return t;
                    }
                  }),
                }
              : c,
          ),
        }
      : b,
  );
};

const toggleSubtask = (
  state: BoardType[],
  payload: ToggleSubtaskAction["payload"],
) => {
  const { boardId, columnId, subtaskId, taskId } = payload;
  return state.map((b) =>
    b.id === boardId
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === columnId
              ? {
                  ...c,
                  tasks: c.tasks.map((t) =>
                    t.id === taskId
                      ? {
                          ...t,
                          subtasks: t.subtasks.map((s) =>
                            s.id === subtaskId
                              ? { ...s, completed: !s.completed }
                              : s,
                          ),
                        }
                      : t,
                  ),
                }
              : c,
          ),
        }
      : b,
  );
};

export const handleOptimisticUpdate = (state: BoardType[], action: Action) => {
  const { type, payload } = action;
  switch (type) {
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
