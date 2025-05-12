import type { BoardType } from "~/types";
import type { ToggleTaskAction } from "~/types/actions";

export const toggleTask = (
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
