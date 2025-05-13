"use server";

import { db } from "./db/index";
import { auth } from "@clerk/nextjs/server";
import { boards, columns, subtasks, tasks } from "./db/schema";
import { revalidateTag } from "next/cache";
import { and, eq, gt, gte, lt, lte, ne, sql } from "drizzle-orm";
import type { DatabaseType } from "~/types";
import {
  ColumnSchema,
  SubtaskSchema,
  TaskSchema,
} from "~/utilities/zod-schemas";
import type {
  CreateColumnAction,
  CreateSubtaskAction,
  CreateTaskAction,
  DeleteColumnAction,
  DeleteSubtaskAction,
  DeleteTaskAction,
  RenameColumnAction,
  RenameSubtaskAction,
  RenameTaskAction,
  SwitchTaskColumnAction,
  ToggleSubtaskAction,
  ToggleTaskAction,
  Action,
} from "~/types/actions";
import { handleCreateBoard } from "./server-actions/board/create-board";
import { handleRenameBoard } from "./server-actions/board/rename-board";
import { handleDeleteBoard } from "./server-actions/board/delete-board";
import { handleMakeBoardCurrent } from "./server-actions/board/make-board-current";

// ------ Column ------
export const handleCreateColumn = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: CreateColumnAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { column } = payload;
    const { boardId } = column;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    if (column.name === "ERROR_TEST")
      throw new Error("(TEST) Error while creating a column");

    const result = ColumnSchema.safeParse(column);
    if (!result.success) {
      throw new Error("Error while creating a column");
    }

    // calculate current max position
    const columnsOrdered = await tx.query.columns.findMany({
      where: (model, { eq }) => eq(model.boardId, boardId),
      orderBy: (model, { desc }) => desc(model.index),
      limit: 1,
    });

    const maxIndex = columnsOrdered[0]?.index ?? 0;

    if (typeof maxIndex === undefined) throw new Error("No max index");
    if (maxIndex + 1 !== column.index) throw new Error("Wrong index");

    await tx.insert(columns).values(column);
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while creating a column";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};

export const handleRenameColumn = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: RenameColumnAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { columnId, newColumnName } = payload;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    if (newColumnName === "ERROR_TEST")
      throw new Error("(TEST) Error while renaming a column");

    const result = ColumnSchema.pick({ id: true, name: true }).safeParse({
      id: columnId,
      name: newColumnName,
    });
    if (!result.success) {
      throw new Error("Error while renaming a column");
    }

    await tx
      .update(columns)
      .set({ name: newColumnName, updatedAt: new Date() })
      .where(and(eq(columns.id, columnId)));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while renaming column";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};

export const handleDeleteColumn = async ({
  action,
  tx = db,
  inTransaction = false,
}: {
  action: DeleteColumnAction;
  tx?: DatabaseType;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { boardId, columnId } = payload;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const result = ColumnSchema.pick({ id: true, boardId: true }).safeParse({
      id: columnId,
      boardId,
    });
    if (!result.success) {
      throw new Error("Error while deleting a column");
    }

    const column = await tx.query.columns.findFirst({
      where: (model, { eq }) => eq(model.id, columnId),
    });
    if (!column) throw new Error("Column not found");

    if (column.name === "COLUMN_ERROR_TEST")
      throw new Error("(TEST) Error while deleting a column");

    await tx
      .update(columns)
      .set({ index: sql`${columns.index} - 1` })
      .where(
        and(
          eq(columns.boardId, column.boardId),
          gt(columns.index, column.index),
        ),
      );
    await tx.delete(columns).where(eq(columns.id, columnId));
    revalidateTag(`boards-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while deleting a column";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
};

// ------ Task ------
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
