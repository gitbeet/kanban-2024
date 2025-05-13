"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { tasks } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { CreateTaskAction } from "~/types/actions";
import { TaskSchema } from "~/utilities/zod-schemas";

export const handleCreateTask = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: CreateTaskAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { columnId, task } = payload;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    if (task.name === "ERROR_TEST")
      throw new Error("(TEST) Error while creating a task");

    const result = TaskSchema.safeParse(task);
    if (!result.success) throw new Error("Error while creating a task");

    // calculate current max position
    const tasksOrdered = await tx.query.tasks.findMany({
      where: (model, { eq }) => eq(model.columnId, columnId),
      orderBy: (model, { desc }) => desc(model.index),
      limit: 1,
    });

    const maxIndex = tasksOrdered[0]?.index ?? 0;
    if (typeof maxIndex === undefined) throw new Error("No max index");
    if (maxIndex + 1 !== task.index) throw new Error("Wrong index");

    await tx.insert(tasks).values(task);
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while creating a task";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
