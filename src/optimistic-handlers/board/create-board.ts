import type { BoardType } from "~/types";
import type { CreateBoardAction } from "~/types/actions";

export const createBoard = (
  state: BoardType[],
  payload: CreateBoardAction["payload"],
) => {
  const { board } = payload;
  const allfalse = state.map((b) => ({ ...b, current: false }));
  return [...allfalse, board];
};
