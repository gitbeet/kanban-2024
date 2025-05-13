"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { boards } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { CreateBoardAction } from "~/types/actions";
import { BoardSchema } from "~/utilities/zod-schemas";

export const handleCreateBoard = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: CreateBoardAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  const { payload } = action;
  const { board } = payload;
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    if (board.name === "ERROR_TEST")
      throw new Error("(TEST) Error while creating a board");

    const boardsOrdered = await tx.query.boards.findMany({
      where: (model, { eq }) => eq(model.userId, userId),
      orderBy: (model, { desc }) => desc(model.index),
      limit: 1,
    });

    const maxIndex = boardsOrdered[0]?.index ?? 0;
    if (typeof maxIndex === undefined) throw new Error("No max index");
    if (maxIndex + 1 !== board.index) throw new Error("Wrong index");

    const result = BoardSchema.safeParse(board);
    if (!result.success) {
      throw new Error(
        result.error.issues[0]?.message ?? "Error while creating a board",
      );
    }

    await tx
      .update(boards)
      .set({ current: false })
      .where(eq(boards.userId, userId));

    await tx.insert(boards).values(board);
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while creating a board";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
