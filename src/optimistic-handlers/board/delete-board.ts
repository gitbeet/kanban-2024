import type { BoardType } from "~/types";
import type { DeleteBoardAction } from "~/types/actions";

export const deleteBoard = (
  state: BoardType[],
  payload: DeleteBoardAction["payload"],
) => {
  const { boardId, wasCurrent } = payload;
  const board = state.find((board) => board.id === boardId);
  if (!board || !boardId) return state;
  let updatedBoards = state
    // filter the deleted board
    .filter((b) => b.id !== boardId)
    // decrement the index of the tasks below
    .map((b) =>
      b.index > board?.index
        ? { ...b, index: b.index - 1, updatedAt: new Date() }
        : b,
    );
  // If the deleted board was current , set the first board as current else nothing
  if (wasCurrent) {
    updatedBoards = updatedBoards.map((b, i) =>
      i === 0 ? { ...b, current: true } : { ...b, current: false },
    );
  }
  return updatedBoards;
};
