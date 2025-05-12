import type { BoardType } from "~/types";
import type { DeleteTaskAction } from "~/types/actions";

export const deleteTask = (
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
