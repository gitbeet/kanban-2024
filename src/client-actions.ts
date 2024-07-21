import { FormEvent } from "react";
import { renameColumnAction } from "./actions";
import type { SetOptimisticType } from "./types";
import { BoardSchema, ColumnSchema } from "./zod-schemas";

export const renameColumnclientAction = async (
  boardId: string,
  columnId: string,
  newColumnName: string,
  setOptimisticBoards: SetOptimisticType,
  handleError: (error: { error: string }) => void,
) => {
  // Client error check
  const result = ColumnSchema.shape.name.safeParse(newColumnName);
  if (!result.success) {
    handleError({
      error: result.error.issues[0]?.message ?? "An error occured",
    });
    // return { error: result.error.issues[0]?.message ?? "An error occured" };
  }
  setOptimisticBoards({
    action: "renameColumn",
    boardId,
    columnId,
    newColumnName,
  });
  const response = await renameColumnAction(columnId, newColumnName);
  if (response?.error) {
    handleError({ error: response.error });
    // return { error: response.error };
  }
};
