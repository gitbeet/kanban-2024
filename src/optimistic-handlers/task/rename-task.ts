import type { BoardType } from "~/types";
import type { RenameTaskAction } from "~/types/actions";

export const renameTask = (
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
