import type { BoardType } from "~/types";
import type { DeleteColumnAction } from "~/types/actions";

export const deleteColumn = (
  state: BoardType[],
  payload: DeleteColumnAction["payload"],
) => {
  const { boardId, columnId } = payload;
  return state.map((b) =>
    b.id === boardId
      ? { ...b, columns: b.columns.filter((c) => c.id !== columnId) }
      : b,
  );
};
