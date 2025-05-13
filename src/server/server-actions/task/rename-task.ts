"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { tasks } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { RenameTaskAction } from "~/types/actions";
import { TaskSchema } from "~/utilities/zod-schemas";

export const handleRenameTask = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: RenameTaskAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { taskId, newTaskName } = payload;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    if (newTaskName === "ERROR_TEST")
      throw new Error("(TEST) Error while renaming a task");

    const result = TaskSchema.pick({ id: true, name: true }).safeParse({
      id: taskId,
      name: newTaskName,
    });
    if (!result.success) throw new Error("Error while renaming a task");
    await tx
      .update(tasks)
      .set({ name: newTaskName, updatedAt: new Date() })
      .where(eq(tasks.id, taskId));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while renaming a task";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
