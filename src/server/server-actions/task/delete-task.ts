"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, gt, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { tasks } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { DeleteTaskAction } from "~/types/actions";
import { TaskSchema } from "~/utilities/zod-schemas";

export const handleDeleteTask = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: DeleteTaskAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { taskId } = payload;
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const result = TaskSchema.pick({ id: true }).safeParse({ id: taskId });
    if (!result.success) throw new Error("Error while deleting a task");

    const task = await tx.query.tasks.findFirst({
      where: (model, { eq }) => eq(model.id, taskId),
    });

    if (!task) throw new Error("Task not found");
    if (task.name === "DELETE_TASK_ERROR_TEST")
      throw new Error("(TEST) Error while deleting a task");

    await tx
      .update(tasks)
      .set({ index: sql`${tasks.index} - 1` })
      .where(
        and(eq(tasks.columnId, task.columnId), gt(tasks.index, task.index)),
      );
    await tx.delete(tasks).where(eq(tasks.id, taskId));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while deleting a task";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
