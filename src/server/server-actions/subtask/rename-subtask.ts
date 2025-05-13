"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { subtasks } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { RenameSubtaskAction } from "~/types/actions";
import { SubtaskSchema } from "~/utilities/zod-schemas";

export const handleRenameSubtask = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: RenameSubtaskAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const { payload } = action;
  const { newSubtaskName, subtaskId } = payload;

  try {
    const result = SubtaskSchema.pick({ id: true, name: true }).safeParse({
      id: subtaskId,
      name: newSubtaskName,
    });
    if (!result.success) throw new Error("Error while renaming subtask");

    await tx
      .update(subtasks)
      .set({ name: newSubtaskName, updatedAt: new Date() })
      .where(eq(subtasks.id, subtaskId));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while renaming subtask";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
