"use server";

import { db } from "./db/index";
import { auth } from "@clerk/nextjs/server";
import { subtasks, tasks } from "./db/schema";
import { revalidateTag } from "next/cache";
import { and, eq, gt, gte, lt, lte, ne, sql } from "drizzle-orm";
import type { DatabaseType } from "~/types";
import {
  ColumnSchema,
  SubtaskSchema,
  TaskSchema,
} from "~/utilities/zod-schemas";
import type {
  CreateSubtaskAction,
  DeleteSubtaskAction,
  RenameSubtaskAction,
  SwitchTaskColumnAction,
  ToggleSubtaskAction,
  ToggleTaskAction,
  Action,
} from "~/types/actions";
import { handleCreateBoard } from "./server-actions/board/create-board";
import { handleRenameBoard } from "./server-actions/board/rename-board";
import { handleDeleteBoard } from "./server-actions/board/delete-board";
import { handleMakeBoardCurrent } from "./server-actions/board/make-board-current";
import { handleCreateColumn } from "./server-actions/column/create-column";
import { handleRenameColumn } from "./server-actions/column/rename-column";
import { handleDeleteColumn } from "./server-actions/column/delete-column";
import { handleCreateTask } from "./server-actions/task/create-task";
import { handleRenameTask } from "./server-actions/task/rename-task";
import { handleDeleteTask } from "./server-actions/task/delete-task";
import { handleToggleTaskCompleted } from "./server-actions/task/toggle-task";
import { handleSwitchTaskColumn } from "./server-actions/task/switch-task-column";

// ------ Task ------

// ------ Subtask ------
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

export const handleToggleSubtaskCompleted = async ({
  action,
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

// ------ Transaction ------
export async function mutateTable(actions: Action[]) {
  const user = auth();
  try {
    if (!user.userId) throw new Error("Unauthorized");
    await db.transaction(async (tx) => {
      for (const action of actions) {
        switch (action.type) {
          // Boards
          case "CREATE_BOARD":
            await handleCreateBoard({
              action,
              tx,
              inTransaction: true,
            });
            break;
          case "RENAME_BOARD":
            await handleRenameBoard({
              action,
              tx,
              inTransaction: true,
            });
            break;
          case "DELETE_BOARD":
            await handleDeleteBoard({
              action,
              tx,
              inTransaction: true,
            });
            break;
          case "MAKE_BOARD_CURRENT":
            await handleMakeBoardCurrent({
              action,
              tx,
              inTransaction: true,
            });
            break;

          // Columns
          case "CREATE_COLUMN":
            await handleCreateColumn({ action, tx, inTransaction: true });
            break;
          case "RENAME_COLUMN":
            await handleRenameColumn({ action, tx, inTransaction: true });
            break;
          case "DELETE_COLUMN":
            await handleDeleteColumn({ action, tx, inTransaction: true });
            break;

          // Tasks
          case "CREATE_TASK":
            await handleCreateTask({ action, tx, inTransaction: true });
            break;
          case "RENAME_TASK":
            await handleRenameTask({ action, tx, inTransaction: true });
            break;
          case "DELETE_TASK":
            await handleDeleteTask({ action, tx, inTransaction: true });
            break;
          case "TOGGLE_TASK":
            await handleToggleTaskCompleted({
              action,
              tx,
              inTransaction: true,
            });
            break;
          case "SWITCH_TASK_COLUMN":
            await handleSwitchTaskColumn({ action, tx, inTransaction: true });
            break;

          // Subtasks
          case "CREATE_SUBTASK":
            await handleCreateSubtask({ action, tx, inTransaction: true });
            break;
          case "RENAME_SUBTASK":
            await handleRenameSubtask({ action, tx, inTransaction: true });
            break;
          case "DELETE_SUBTASK":
            await handleDeleteSubtask({ action, tx, inTransaction: true });
            break;
          case "TOGGLE_SUBTASK":
            await handleToggleSubtaskCompleted({
              action,
              tx,
              inTransaction: true,
            });
            break;

          // DEFAULT
          default:
            throw new Error(`An error has occurred`);
        }
      }
    });
    revalidateTag(`boards-${user.userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error has occurred";
    return { error: errorMessage };
  }
}
