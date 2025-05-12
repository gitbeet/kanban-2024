import type { BoardType } from "~/types";
import type { RenameSubtaskAction } from "~/types/actions";

export const renameSubtask = (
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
