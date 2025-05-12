import type { BoardType, TaskType } from "~/types";
import type { SwitchTaskColumnAction } from "~/types/actions";

export const switchTaskColumn = (
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
