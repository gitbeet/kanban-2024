"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, gt, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { subtasks } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { DeleteSubtaskAction } from "~/types/actions";
import { SubtaskSchema } from "~/utilities/zod-schemas";

export const handleDeleteSubtask = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: DeleteSubtaskAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const { payload } = action;
    const { subtaskId } = payload;

    const result = SubtaskSchema.pick({ id: true }).safeParse({
      id: subtaskId,
    });
    if (!result.success) throw new Error("Error while deleting a subtask");

    const subtask = await tx.query.subtasks.findFirst({
      where: (model, { eq }) => eq(model.id, subtaskId),
    });
    if (!subtask) throw new Error("Subtask not found");
    await tx
      .update(subtasks)
      .set({ index: sql`${subtasks.index} - 1` })
      .where(
        and(
          eq(subtasks.taskId, subtask.taskId),
          gt(subtasks.index, subtask.index),
        ),
      );
    await tx.delete(subtasks).where(eq(subtasks.id, subtaskId));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while deleting subtask";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
