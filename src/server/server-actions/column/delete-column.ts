"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, gt, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { columns } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { DeleteColumnAction } from "~/types/actions";
import { ColumnSchema } from "~/utilities/zod-schemas";

export const handleDeleteColumn = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: DeleteColumnAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { boardId, columnId } = payload;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const result = ColumnSchema.pick({ id: true, boardId: true }).safeParse({
      id: columnId,
      boardId,
    });
    if (!result.success) {
      throw new Error("Error while deleting a column");
    }

    const column = await tx.query.columns.findFirst({
      where: (model, { eq }) => eq(model.id, columnId),
    });
    if (!column) throw new Error("Column not found");

    if (column.name === "COLUMN_ERROR_TEST")
      throw new Error("(TEST) Error while deleting a column");

    await tx
      .update(columns)
      .set({ index: sql`${columns.index} - 1` })
      .where(
        and(
          eq(columns.boardId, column.boardId),
          gt(columns.index, column.index),
        ),
      );
    await tx.delete(columns).where(eq(columns.id, columnId));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while deleting a column";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
