"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, gt, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { boards } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { DeleteBoardAction } from "~/types/actions";
import { BoardSchema } from "~/utilities/zod-schemas";

export const handleDeleteBoard = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: DeleteBoardAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { boardId, boardIndex, wasCurrent } = payload;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const result = BoardSchema.pick({ id: true, index: true }).safeParse({
      id: boardId,
      index: boardIndex,
    });

    if (!result.success) {
      throw new Error(
        result.error.issues[0]?.message ?? "Error while deleting a board",
      );
    }

    await tx
      .update(boards)
      .set({ index: sql`${boards.index} - 1` })
      .where(and(gt(boards.index, boardIndex), eq(boards.userId, userId)));
    await tx
      .delete(boards)
      .where(and(eq(boards.id, boardId), eq(boards.userId, userId)));
    if (!wasCurrent) return revalidatePath("/");
    await tx
      .update(boards)
      .set({ current: true })
      .where(and(eq(boards.index, 1), eq(boards.userId, userId)));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while deleting board";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
