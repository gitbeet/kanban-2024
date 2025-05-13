"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { boards } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { RenameBoardAction } from "~/types/actions";
import { BoardSchema } from "~/utilities/zod-schemas";

export const handleRenameBoard = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: RenameBoardAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { boardId, newBoardName } = payload;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    if (newBoardName === "ERROR_TEST")
      throw new Error("(TEST) Error while renaming a board");

    const result = BoardSchema.pick({ id: true, name: true }).safeParse({
      id: boardId,
      name: newBoardName,
    });
    if (!result.success) {
      throw new Error(
        result.error.issues[0]?.message ?? "Error while renaming a board",
      );
    }

    await tx
      .update(boards)
      .set({ name: newBoardName, updatedAt: new Date() })
      .where(and(eq(boards.id, boardId), eq(boards.userId, userId)));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while a renaming board";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
