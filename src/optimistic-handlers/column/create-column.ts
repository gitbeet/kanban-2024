import type { BoardType } from "~/types";
import type { CreateColumnAction } from "~/types/actions";

export const createColumn = (
  state: BoardType[],
  payload: CreateColumnAction["payload"],
) => {
  const { column } = payload;
  return state.map((b) =>
    b.id === column.boardId ? { ...b, columns: [...b.columns, column] } : b,
  );
};
