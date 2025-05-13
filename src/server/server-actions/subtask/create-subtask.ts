"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { subtasks } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { CreateSubtaskAction } from "~/types/actions";
import { SubtaskSchema } from "~/utilities/zod-schemas";

export const handleCreateSubtask = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: CreateSubtaskAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const { payload } = action;
    const { subtask } = payload;

    if (subtask.name === "ERROR_TEST")
      throw new Error("(TEST) Error while creating a task");

    const result = SubtaskSchema.safeParse(subtask);
    if (!result.success) throw new Error("Error while creating a subtask");

    const subtasksOrdered = await tx.query.subtasks.findMany({
      where: (model, { eq }) => eq(model.taskId, subtask.taskId),
      orderBy: (model, { desc }) => desc(model.index),
      limit: 1,
    });
    const maxIndex = subtasksOrdered[0]?.index ?? 0;
    if (typeof maxIndex === undefined) throw new Error("No max index");
    if (maxIndex + 1 !== subtask.index) throw new Error("Wrong index");

    await tx.insert(subtasks).values(subtask);
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while creating a subtask";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
