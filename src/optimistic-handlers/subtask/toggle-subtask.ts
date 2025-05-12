import type { BoardType } from "~/types";
import type { ToggleSubtaskAction } from "~/types/actions";

export const toggleSubtask = (
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
