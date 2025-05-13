"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { columns } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { CreateColumnAction } from "~/types/actions";
import { ColumnSchema } from "~/utilities/zod-schemas";

export const handleCreateColumn = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: CreateColumnAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { column } = payload;
    const { boardId } = column;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    if (column.name === "ERROR_TEST")
      throw new Error("(TEST) Error while creating a column");

    const result = ColumnSchema.safeParse(column);
    if (!result.success) {
      throw new Error("Error while creating a column");
    }

    // calculate current max position
    const columnsOrdered = await tx.query.columns.findMany({
      where: (model, { eq }) => eq(model.boardId, boardId),
      orderBy: (model, { desc }) => desc(model.index),
      limit: 1,
    });

    const maxIndex = columnsOrdered[0]?.index ?? 0;

    if (typeof maxIndex === undefined) throw new Error("No max index");
    if (maxIndex + 1 !== column.index) throw new Error("Wrong index");

    await tx.insert(columns).values(column);
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while creating a column";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
