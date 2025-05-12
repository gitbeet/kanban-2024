import type { BoardType } from "~/types";

export const setInitialBoards = (
  state: BoardType[],
  payload: { boards: BoardType[] },
) => {
  const { boards } = payload;
  return [...state, ...boards];
};
