import type { BoardType } from "~/types";
import type { MakeBoardCurrentAction } from "~/types/actions";

export const makeBoardCurrent = (
  state: BoardType[],
  payload: MakeBoardCurrentAction["payload"],
) => {
  const { newCurrentBoardId } = payload;
  return state
    .map((b) => ({ ...b, current: false }))
    .map((b) =>
      b.id === newCurrentBoardId
        ? { ...b, current: true, updatedAt: new Date() }
        : b,
    );
};
