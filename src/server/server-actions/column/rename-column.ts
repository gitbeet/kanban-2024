"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { columns } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { RenameColumnAction } from "~/types/actions";
import { ColumnSchema } from "~/utilities/zod-schemas";

export const handleRenameColumn = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: RenameColumnAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { columnId, newColumnName } = payload;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    if (newColumnName === "ERROR_TEST")
      throw new Error("(TEST) Error while renaming a column");

    const result = ColumnSchema.pick({ id: true, name: true }).safeParse({
      id: columnId,
      name: newColumnName,
    });
    if (!result.success) {
      throw new Error("Error while renaming a column");
    }

    await tx
      .update(columns)
      .set({ name: newColumnName, updatedAt: new Date() })
      .where(and(eq(columns.id, columnId)));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while renaming column";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
