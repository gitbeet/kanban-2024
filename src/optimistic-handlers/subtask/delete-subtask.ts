import type { BoardType } from "~/types";
import type { DeleteSubtaskAction } from "~/types/actions";

export const deleteSubtask = (
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
