/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TaskType, BoardType, SubtaskType } from "./types";
import {
  CreateBoardUpdate,
  CreateColumnUpdate,
  CreateSubtaskUpdate,
  CreateTaskUpdate,
  DeleteBoardUpdate,
  DeleteColumnUpdate,
  DeleteSubtaskUpdate,
  DeleteTaskUpdate,
  MakeBoardCurrentUpdate,
  RenameBoardUpdate,
  RenameColumnUpdate,
  RenameSubtaskUpdate,
  RenameTaskUpdate,
  SwitchTaskColumnUpdate,
  ToggleSubtaskUpdate,
  ToggleTaskUpdate,
  Update,
} from "./types/updates";

// Boards

const createBoard = (
  state: BoardType[],
  payload: CreateBoardUpdate["payload"],
) => {
  const { board } = payload;
  const allfalse = state.map((b) => ({ ...b, current: false }));
  return [...allfalse, board];
};

const renameBoard = (
  state: BoardType[],
  payload: RenameBoardUpdate["payload"],
) => {
  const { boardId, newBoardName } = payload;
  if (!boardId || !newBoardName) return state;
  return state.map((b) =>
    b.id === boardId ? { ...b, name: newBoardName, updatedAt: new Date() } : b,
  );
};

const deleteBoard = (
  state: BoardType[],
  payload: DeleteBoardUpdate["payload"],
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
  payload: MakeBoardCurrentUpdate["payload"],
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
  payload: CreateColumnUpdate["payload"],
) => {
  const { column } = payload;
  return state.map((b) =>
    b.id === column.boardId ? { ...b, columns: [...b.columns, column] } : b,
  );
};

const renameColumn = (
  state: BoardType[],
  payload: RenameColumnUpdate["payload"],
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
  payload: DeleteColumnUpdate["payload"],
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
  payload: CreateTaskUpdate["payload"],
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
  payload: RenameTaskUpdate["payload"],
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
  payload: DeleteTaskUpdate["payload"],
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
  payload: ToggleTaskUpdate["payload"],
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
  payload: SwitchTaskColumnUpdate["payload"],
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
  payload: CreateSubtaskUpdate["payload"],
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

const deleteSubtask = (
  state: BoardType[],
  payload: DeleteSubtaskUpdate["payload"],
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

const renameSubtask = (
  state: BoardType[],
  payload: RenameSubtaskUpdate["payload"],
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

const toggleSubtask = (
  state: BoardType[],
  payload: ToggleSubtaskUpdate["payload"],
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

export const handleOptimisticUpdate = (state: BoardType[], update: Update) => {
  const { action, payload } = update;
  switch (action) {
    case "createBoard":
      return createBoard(state, payload);
    case "renameBoard":
      return renameBoard(state, payload);
    case "deleteBoard":
      return deleteBoard(state, payload);
    case "makeBoardCurrent":
      return makeBoardCurrent(state, payload);
    case "createColumn":
      return createColumn(state, payload);
    case "renameColumn":
      return renameColumn(state, payload);
    case "deleteColumn":
      return deleteColumn(state, payload);
    case "createTask":
      return createTask(state, payload);
    case "renameTask":
      return renameTask(state, payload);
    case "deleteTask":
      return deleteTask(state, payload);
    case "toggleTask":
      return toggleTask(state, payload);
    case "switchTaskColumn":
      return switchTaskColumn(state, payload);
    case "createSubtask":
      return createSubtask(state, payload);
    case "deleteSubtask":
      return deleteSubtask(state, payload);
    case "renameSubtask":
      return renameSubtask(state, payload);
    case "toggleSubtask":
      return toggleSubtask(state, payload);
    default:
      break;
  }
  return state;
};
// export const handleOptimisticUpdate = (
//   state: BoardType[],
//   {
//     action,
//     boards,
//     board,
//     boardId,
//     newBoardName,
//     column,
//     columnId,
//     newColumnName,
//     task,
//     taskId,
//     newTaskName,
//     subtask,
//     subtaskId,
//     newSubtaskName,
//     oldColumnId,
//     newColumnId,
//     oldColumnIndex,
//     newColumnIndex,
//   }: OptimisticParams,
// ) => {
//   switch (action) {
//     case "createBoard":
//       return createBoard(state, board);
//     case "renameBoard":
//       return renameBoard(state, boardId, newBoardName);
//     case "deleteBoard":
//       return deleteBoard(state, boardId);
//     case "makeBoardCurrent":
//       return makeBoardCurrent(state, boardId);
//     case "createColumn":
//       return createColumn(state, boardId, column);
//     case "renameColumn":
//       return renameColumn(state, boardId, columnId, newColumnName);
//     case "deleteColumn":
//       return deleteColumn(state, boardId, columnId);
//     case "createTask":
//       return createTask(state, boardId, columnId, task);
//     case "renameTask":
//       return renameTask(state, boardId, columnId, taskId, newTaskName);
//     case "deleteTask":
//       return deleteTask(state, boardId, columnId, taskId);
//     case "toggleTask":
//       return toggleTask(state, boardId, columnId, taskId);
//     case "switchTaskColumn":
//       return switchTaskColumn(
//         state,
//         boardId,
//         taskId,
//         oldColumnId,
//         newColumnId,
//         oldColumnIndex,
//         newColumnIndex,
//       );
//     case "createSubtask":
//       return createSubtask(state, boardId, columnId, taskId, subtask);
//     case "deleteSubtask":
//       return deleteSubtask(state, boardId, columnId, taskId, subtaskId);
//     case "renameSubtask":
//       return renameSubtask(
//         state,
//         boardId,
//         columnId,
//         taskId,
//         subtaskId,
//         newSubtaskName,
//       );
//     case "toggleSubtask":
//       return toggleSubtask(state, boardId, columnId, taskId, subtaskId);
//     default:
//       break;
//   }
//   return state;
// };
