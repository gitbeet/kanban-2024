import type { BoardType } from "~/types";
import type { RenameBoardAction } from "~/types/actions";

export const renameBoard = (
  state: BoardType[],
  payload: RenameBoardAction["payload"],
) => {
  const { boardId, newBoardName } = payload;
  if (!boardId || !newBoardName) return state;
  return state.map((b) =>
    b.id === boardId ? { ...b, name: newBoardName, updatedAt: new Date() } : b,
  );
};
