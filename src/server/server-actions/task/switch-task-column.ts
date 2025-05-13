"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, gte, lt, lte, ne, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { tasks } from "~/server/db/schema";
import type { DatabaseType } from "~/types";
import type { SwitchTaskColumnAction } from "~/types/actions";
import { ColumnSchema, TaskSchema } from "~/utilities/zod-schemas";

export const handleSwitchTaskColumn = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: SwitchTaskColumnAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const { payload } = action;
    const { newColumnId, newColumnIndex, oldColumnId, oldColumnIndex, taskId } =
      payload;

    const oldColumnParseResult = ColumnSchema.pick({
      id: true,
      index: true,
    }).safeParse({
      id: oldColumnId,
      index: oldColumnIndex,
    });
    const newColumnParseResult = ColumnSchema.pick({
      id: true,
      index: true,
    }).safeParse({
      id: newColumnId,
      index: newColumnIndex,
    });
    const taskParseResult = TaskSchema.pick({ id: true }).safeParse({
      id: taskId,
    });
    if (
      !oldColumnParseResult.success ||
      !newColumnParseResult.success ||
      !taskParseResult.success
    )
      throw new Error("Error while switching a task column");

    const inTheSameColumn = oldColumnId === newColumnId;
    if (inTheSameColumn) {
      // check which direction we're moving in
      const movingUp = oldColumnIndex > newColumnIndex;
      if (movingUp) {
        // update the task index
        await tx
          .update(tasks)
          .set({ index: newColumnIndex, updatedAt: new Date() })
          .where(eq(tasks.id, taskId));
        // Increment all indices between the old and the new, excluding the dragged task's index
        await tx
          .update(tasks)
          .set({ index: sql`${tasks.index} + 1` })
          .where(
            and(
              eq(tasks.columnId, newColumnId),
              ne(tasks.id, taskId),
              gte(tasks.index, newColumnIndex),
              lte(tasks.index, oldColumnIndex),
            ),
          );
      } else {
        // update the task index
        await tx
          .update(tasks)
          .set({
            index: newColumnIndex - 1,
            updatedAt: new Date(),
          })
          .where(eq(tasks.id, taskId));
        // Decrement all indices between the old and the new, excluding the dragged task's index
        await tx
          .update(tasks)
          .set({ index: sql`${tasks.index} - 1` })
          .where(
            and(
              eq(tasks.columnId, newColumnId),
              ne(tasks.id, taskId),
              gte(tasks.index, oldColumnIndex),
              lt(tasks.index, newColumnIndex),
            ),
          );
      }
    } else {
      // When we are dragging the task to a different column
      await tx
        .update(tasks)
        .set({ index: sql`${tasks.index} - 1` })
        .where(
          and(
            eq(tasks.columnId, oldColumnId),
            gte(tasks.index, oldColumnIndex),
          ),
        );
      await tx
        .update(tasks)
        .set({ index: sql`${tasks.index} + 1` })
        .where(
          and(
            eq(tasks.columnId, newColumnId),
            gte(tasks.index, newColumnIndex),
          ),
        );

      await tx
        .update(tasks)
        .set({
          columnId: newColumnId,
          index: newColumnIndex,
        })
        .where(eq(tasks.id, taskId));
    }
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error while switching task column";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};
