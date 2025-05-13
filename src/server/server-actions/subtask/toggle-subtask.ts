"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { subtasks } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { ToggleSubtaskAction } from "~/types/actions";
import { SubtaskSchema } from "~/utilities/zod-schemas";

export const handleToggleSubtaskCompleted = async ({
  action,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  tx = db,
  inTransaction = false,
}: {
  action: ToggleSubtaskAction;
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
    if (!result.success) throw new Error("Error while togglingh a subtask");

    const subtask = await tx.query.subtasks.findFirst({
      where: (model, { eq }) => eq(model.id, subtaskId),
    });

    if (!subtask) throw new Error("Subtask not found!");

    await tx
      .update(subtasks)
      .set({ completed: !subtask.completed, updatedAt: new Date() })
      .where(eq(subtasks.id, subtaskId));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while toggling subtask";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
