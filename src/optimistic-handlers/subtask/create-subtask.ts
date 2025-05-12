import type { BoardType } from "~/types";
import type { CreateSubtaskAction } from "~/types/actions";

export const createSubtask = (
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
