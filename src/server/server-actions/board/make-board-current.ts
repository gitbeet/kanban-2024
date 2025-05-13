"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { boards } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { MakeBoardCurrentAction } from "~/types/actions";

export const handleMakeBoardCurrent = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: MakeBoardCurrentAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { oldCurrentBoardId, newCurrentBoardId } = payload;
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    await tx
      .update(boards)
      .set({ current: false, updatedAt: new Date() })
      .where(and(eq(boards.id, oldCurrentBoardId), eq(boards.userId, userId)));
    await tx
      .update(boards)
      .set({ current: true })
      .where(and(eq(boards.id, newCurrentBoardId), eq(boards.userId, userId)));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error while making board current";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
