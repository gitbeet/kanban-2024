import type { BoardType } from "~/types";
import type { CreateTaskAction } from "~/types/actions";

export const createTask = (
  state: BoardType[],
  payload: CreateTaskAction["payload"],
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
