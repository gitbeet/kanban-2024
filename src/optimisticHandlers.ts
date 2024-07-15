/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  BoardType,
  ColumnType,
  OptimisticParams,
  TaskType,
} from "./types";

// Boards
const getInitialBoards = (state: BoardType[], boards?: BoardType[]) => {
  if (!boards) return state;
  return [...state, ...boards];
};

const createBoard = (state: BoardType[], board?: BoardType) => {
  if (!board) return state;
  return [...state, board];
};

const renameBoard = (
  state: BoardType[],
  boardId?: string,
  newBoardName?: string,
) => {
  if (!boardId || !newBoardName) return state;
  return state.map((b) =>
    b.id === boardId ? { ...b, name: newBoardName, updatedAt: new Date() } : b,
  );
};

const deleteBoard = (state: BoardType[], boardId?: string) => {
  if (!boardId) return state;
  return state.filter((b) => b.id !== boardId);
};

// Columns
const createColumn = (
  state: BoardType[],
  board?: BoardType,
  column?: ColumnType,
) => {
  if (!board || !column) return state;
  return state.map((b) =>
    b.id === board.id ? { ...b, columns: [...b.columns, column] } : b,
  );
};

const renameColumn = (
  state: BoardType[],
  board?: BoardType,
  column?: ColumnType,
) => {
  if (!board || !column) return state;
  return state.map((b) =>
    b.id === board.id
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === column.id ? { ...c, name: column.name } : c,
          ),
        }
      : b,
  );
};

const deleteColumn = (
  state: BoardType[],
  board?: BoardType,
  column?: ColumnType,
) => {
  if (!board || !column) return state;
  return state.map((b) =>
    b.id === board.id
      ? { ...b, columns: b.columns.filter((c) => c.id !== column.id) }
      : b,
  );
};

// Tasks
const createTask = (
  state: BoardType[],
  board?: BoardType,
  column?: ColumnType,
  task?: TaskType,
) => {
  if (!board || !column || !task) return state;
  return state.map((b) =>
    b.id === board.id
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === column.id ? { ...c, tasks: [...c.tasks, task] } : c,
          ),
        }
      : b,
  );
};

const renameTask = (
  state: BoardType[],
  board?: BoardType,
  column?: ColumnType,
  task?: TaskType,
) => {
  if (!board || !column || !task) return state;
  return state.map((b) =>
    b.id === board.id
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === column.id
              ? {
                  ...c,
                  tasks: c.tasks.map((t) =>
                    t.id === task.id ? { ...t, name: task.name } : t,
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
  board?: BoardType,
  columnId?: string,
  taskId?: string,
  taskIndex?: number,
) => {
  if (!board || !columnId || !taskId || !taskIndex) return state;
  return state.map((b) =>
    b.id === board.id
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === columnId
              ? {
                  ...c,
                  tasks: c.tasks
                    .filter((t) => t.id !== taskId)
                    .map((t) =>
                      t.index > taskIndex ? { ...t, index: t.index - 1 } : t,
                    ),
                }
              : c,
          ),
        }
      : b,
  );
};

const toggleTask = (
  state: BoardType[],
  board?: BoardType,
  column?: ColumnType,
  task?: TaskType,
) => {
  if (!board || !column || !task) return state;
  return state.map((b) =>
    b.id === board.id
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === column.id
              ? {
                  ...c,
                  tasks: c.tasks.map((t) =>
                    t.id === task.id ? { ...t, completed: !t.completed } : t,
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
  board?: BoardType,
  column?: ColumnType,
  taskId?: string,
  oldColumnId?: string,
  newColumnId?: string,
  oldColumnIndex?: number,
  newColumnIndex?: number,
) => {
  if (
    !board ||
    !column ||
    !taskId ||
    !oldColumnId ||
    !newColumnId ||
    !newColumnIndex ||
    !oldColumnIndex
  )
    return state;
  const currentBoard = state.find((b) => b.id === board.id);
  const currentColumn = currentBoard?.columns.find(
    (col) => col.id === oldColumnId,
  );
  const currentTask = currentColumn?.tasks.find((task) => task.id === taskId);
  if (!currentTask) return state;
  if (oldColumnId === newColumnId) {
    return state.map((b) => {
      return b.id === board.id
        ? {
            ...b,
            columns: b.columns.map((c) => {
              return c.id === column.id
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
    if (b.id !== board.id) return b;

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

export const handleOptimisticUpdate = (
  state: BoardType[],
  {
    action,
    boards,
    board,
    boardId,
    newBoardName,
    column,
    task,
    columnId,
    taskId,
    oldColumnId,
    newColumnId,
    oldColumnIndex,
    newColumnIndex,
  }: OptimisticParams,
) => {
  switch (action) {
    case "getInitialBoards":
      return getInitialBoards(state, boards);
    case "createBoard":
      return createBoard(state, board);
    case "renameBoard":
      return renameBoard(state, boardId, newBoardName);
    case "deleteBoard":
      return deleteBoard(state, boardId);
    case "createColumn":
      return createColumn(state, board, column);
    case "renameColumn":
      return renameColumn(state, board, column);
    case "deleteColumn":
      return deleteColumn(state, board, column);
    case "createTask":
      return createTask(state, board, column, task);
    case "renameTask":
      return renameTask(state, board, column, task);
    case "deleteTask":
      return deleteTask(state, board, columnId, taskId, oldColumnIndex);
    case "toggleTask":
      return toggleTask(state, board, column, task);
    case "switchTaskColumn":
      return switchTaskColumn(
        state,
        board,
        column,
        taskId,
        oldColumnId,
        newColumnId,
        newColumnIndex,
        oldColumnIndex,
      );
    default:
      break;
  }
  return state;
};
