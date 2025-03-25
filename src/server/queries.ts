"use server";

import { db } from "./db/index";
import { auth } from "@clerk/nextjs/server";
import { backgrounds, boards, columns, subtasks, tasks } from "./db/schema";
import { revalidatePath } from "next/cache";
import { and, eq, gt, gte, lt, lte, ne, sql } from "drizzle-orm";
import type { DatabaseType } from "~/types";
import {
  BoardSchema,
  ColumnSchema,
  SubtaskSchema,
  TaskSchema,
  UserBackgroundSchema,
} from "~/zod-schemas";
import type {
  CreateBoardAction,
  CreateColumnAction,
  CreateSubtaskAction,
  CreateTaskAction,
  DeleteBoardAction,
  DeleteColumnAction,
  DeleteSubtaskAction,
  DeleteTaskAction,
  MakeBoardCurrentAction,
  RenameBoardAction,
  RenameColumnAction,
  RenameSubtaskAction,
  RenameTaskAction,
  SwitchTaskColumnAction,
  ToggleSubtaskAction,
  ToggleTaskAction,
  Action,
  UploadUserBackgroundAction,
  DeleteUserBackgroundAction,
} from "~/types/actions";
import { UTApi } from "uploadthing/server";

export const getBackgrounds = async () => {
  try {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized");
    const backgrounds = await db.query.backgrounds.findMany({
      where: (model, { eq }) => eq(model.userId, user.userId),
    });
    revalidatePath("/");
    return { backgrounds };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error while getting user backgrounds";
    return { error: errorMessage };
  }
};

export const uploadBackground = async (action: UploadUserBackgroundAction) => {
  try {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized");

    const { payload } = action;
    const { background } = payload;

    const result = UserBackgroundSchema.safeParse(background);
    if (!result.success) {
      throw new Error(
        result.error.issues[0]?.message ??
          "Error while uploading a user background",
      );
    }

    if (background.userId !== user.userId) throw new Error("Unauthorized");

    await db.insert(backgrounds).values(background);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error while uploading a user background";
    return { error: errorMessage };
  }
  revalidatePath("/");
};

export const deleteBackground = async (action: DeleteUserBackgroundAction) => {
  try {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized");

    const { payload } = action;
    const { backgroundId, fileKey } = payload;

    const result = UserBackgroundSchema.pick({ id: true }).safeParse({
      id: backgroundId,
    });
    if (!result.success) {
      throw new Error(
        result.error.issues[0]?.message ??
          "Error while deleting a user background",
      );
    }

    const deletedRows = await db
      .delete(backgrounds)
      .where(eq(backgrounds.id, backgroundId));
    if (!deletedRows) throw new Error("Error while deleting the background");

    const api = new UTApi();
    await api.deleteFiles(fileKey);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error while deleting a user background";
    return { error: errorMessage };
  }
  revalidatePath("/");
};

// ------ Board ------
export const getBoards = async () => {
  try {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized");

    const boards = await db.query.boards.findMany({
      where: (model, { eq }) => eq(model.userId, user.userId),
      with: {
        columns: {
          with: {
            tasks: {
              with: {
                subtasks: true,
              },
            },
          },
        },
      },
    });
    revalidatePath("/");
    return { boards };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while getting boards";
    return {
      error: errorMessage,
    };
  }
};

export const handleCreateBoard = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: CreateBoardAction;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = action;
  const { board } = payload;
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    if (board.name === "ERROR_TEST")
      throw new Error("(TEST) Error while creating a board");

    const boardsOrdered = await tx.query.boards.findMany({
      where: (model, { eq }) => eq(model.userId, userId),
      orderBy: (model, { desc }) => desc(model.index),
      limit: 1,
    });

    const maxIndex = boardsOrdered[0]?.index ?? 0;
    if (typeof maxIndex === undefined) throw new Error("No max index");
    if (maxIndex + 1 !== board.index) throw new Error("Wrong index");

    const result = BoardSchema.safeParse(board);
    if (!result.success) {
      throw new Error(
        result.error.issues[0]?.message ?? "Error while creating a board",
      );
    }

    await tx.update(boards).set({ current: false });
    await tx.insert(boards).values(board);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while creating a board";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
  revalidate && revalidatePath("/");
};

export const handleRenameBoard = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: RenameBoardAction;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { boardId, newBoardName } = payload;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    if (newBoardName === "ERROR_TEST")
      throw new Error("(TEST) Error while renaming a board");

    const result = BoardSchema.pick({ id: true, name: true }).safeParse({
      id: boardId,
      name: newBoardName,
    });
    if (!result.success) {
      throw new Error(
        result.error.issues[0]?.message ?? "Error while renaming a board",
      );
    }

    await tx
      .update(boards)
      .set({ name: newBoardName, updatedAt: new Date() })
      .where(and(eq(boards.id, boardId), eq(boards.userId, userId)));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while a renaming board";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
  revalidate && revalidatePath("/");
};

export const handleDeleteBoard = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: DeleteBoardAction;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { boardId, boardIndex, wasCurrent } = payload;

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const result = BoardSchema.pick({ id: true, index: true }).safeParse({
      id: boardId,
      index: boardIndex,
    });

    if (!result.success) {
      throw new Error(
        result.error.issues[0]?.message ?? "Error while deleting a board",
      );
    }

    await tx
      .update(boards)
      .set({ index: sql`${boards.index} - 1` })
      .where(and(gt(boards.index, boardIndex), eq(boards.userId, userId)));
    await tx
      .delete(boards)
      .where(and(eq(boards.id, boardId), eq(boards.userId, userId)));
    if (!wasCurrent) return revalidatePath("/");
    await tx
      .update(boards)
      .set({ current: true })
      .where(and(eq(boards.index, 1), eq(boards.userId, userId)));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while deleting board";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
  revalidate && revalidatePath("/");
};

export const handleMakeBoardCurrent = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: MakeBoardCurrentAction;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = action;
    const { oldCurrentBoardId, newCurrentBoardId } = payload;
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    await tx
      .update(boards)
      .set({ current: false, updatedAt: new Date() })
      .where(and(eq(boards.id, oldCurrentBoardId), eq(boards.userId, userId)));
    await tx
      .update(boards)
      .set({ current: true })
      .where(and(eq(boards.id, newCurrentBoardId), eq(boards.userId, userId)));
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error while making board current";
    if (inTransaction) {
      throw new Error(errorMessage);
    } else {
      return {
        error: errorMessage,
      };
    }
  }
  revalidate && revalidatePath("/");
};

// ------ Column ------
export const handleCreateColumn = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: CreateColumnAction;
  tx?: DatabaseType;
  revalidate?: boolean;
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
  revalidate && revalidatePath("/");
};

export const handleRenameColumn = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: RenameColumnAction;
  tx?: DatabaseType;
  revalidate?: boolean;
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
  revalidate && revalidatePath("/");
};

export const handleDeleteColumn = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: DeleteColumnAction;
  tx?: DatabaseType;
  revalidate?: boolean;
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
  revalidate && revalidatePath("/");
};

// ------ Task ------
export const handleCreateTask = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: CreateTaskAction;
  tx?: DatabaseType;
  revalidate?: boolean;
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
  revalidate && revalidatePath("/");
};

export const handleRenameTask = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: RenameTaskAction;
  tx?: DatabaseType;
  revalidate?: boolean;
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
  revalidate && revalidatePath("/");
};

export const handleDeleteTask = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: DeleteTaskAction;
  tx?: DatabaseType;
  revalidate?: boolean;
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
  revalidate && revalidatePath("/");
};

export const handleToggleTaskCompleted = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: ToggleTaskAction;
  tx?: DatabaseType;
  revalidate?: boolean;
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
  revalidate && revalidatePath("/");
};

export const handleSwitchTaskColumn = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: SwitchTaskColumnAction;
  tx?: DatabaseType;
  revalidate?: boolean;
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
  revalidate && revalidatePath("/");
};

// ------ Subtask ------
export const handleCreateSubtask = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: CreateSubtaskAction;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const { payload } = action;
    const { subtask } = payload;

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
  revalidate && revalidatePath("/");
};

export const handleRenameSubtask = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: RenameSubtaskAction;
  tx?: DatabaseType;
  revalidate?: boolean;
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
  revalidate && revalidatePath("/");
};

export const handleDeleteSubtask = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: DeleteSubtaskAction;
  tx?: DatabaseType;
  revalidate?: boolean;
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
  revalidate && revalidatePath("/");
};

export const handleToggleSubtaskCompleted = async ({
  action,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  action: ToggleSubtaskAction;
  tx?: DatabaseType;
  revalidate?: boolean;
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
  revalidate && revalidatePath("/");
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
    revalidatePath("/");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error has occurred";
    return { error: errorMessage };
  }
}
