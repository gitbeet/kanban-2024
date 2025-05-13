"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { tasks } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { ToggleTaskAction } from "~/types/actions";
import { TaskSchema } from "~/utilities/zod-schemas";

export const handleToggleTaskCompleted = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: ToggleTaskAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { taskId } = payload;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const result = TaskSchema.pick({ id: true }).safeParse({ id: taskId });
    if (!result.success) throw new Error("Error while toggling a task");

    const task = await tx.query.tasks.findFirst({
      where: (model, { eq }) => eq(model.id, taskId),
    });

    if (!task) throw new Error("Task not found!");
    if (task.name === "TOGGLE_TASK_ERROR_TEST")
      throw new Error("(TEST) Error while toggling a task");

    await tx
      .update(tasks)
      .set({ completed: !task.completed, updatedAt: new Date() })
      .where(eq(tasks.id, taskId));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while toggling a task";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
