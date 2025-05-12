import type { BoardType } from "~/types";
import type { RenameColumnAction } from "~/types/actions";

export const renameColumn = (
  state: BoardType[],
  payload: RenameColumnAction["payload"],
) => {
  const { boardId, columnId, newColumnName } = payload;
  return state.map((b) =>
    b.id === boardId
      ? {
          ...b,
          columns: b.columns.map((c) =>
            c.id === columnId ? { ...c, name: newColumnName } : c,
          ),
        }
      : b,
  );
};
