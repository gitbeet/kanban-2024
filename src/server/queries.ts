"use server";

import { db } from "./db/index";
import { auth } from "@clerk/nextjs/server";
import { boards, columns, subtasks, tasks } from "./db/schema";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";
import { and, eq, gt, gte, lt, lte, ne, sql } from "drizzle-orm";
import type {
  CreateBoardChange,
  CreateColumnChange,
  CreateSubtaskChange,
  CreateTaskChange,
  BoardType,
  ColumnType,
  DatabaseType,
  DeleteBoardChange,
  DeleteColumnChange,
  DeleteSubtaskChange,
  DeleteTaskChange,
  MakeBoardCurrentChange,
  RenameBoardChange,
  RenameColumnChange,
  RenameSubtaskChange,
  RenameTaskChange,
  SubtaskType,
  SwitchTaskColumnChange,
  Change,
  TaskType,
  ToggleSubtaskCompletedChange,
  ToggleTaskCompletedChange,
} from "~/types";
import {
  BoardSchema,
  ColumnSchema,
  SubtaskSchema,
  TaskSchema,
} from "~/zod-schemas";
import {
  CreateBoardUpdate,
  CreateColumnUpdate,
  CreateSubtaskUpdate,
  CreateTaskUpdate,
  DeleteBoardUpdate,
  DeleteColumnUpdate,
  DeleteSubtaskUpdate,
  DeleteTaskUpdate,
  MakeBoardCurrentUpdate,
  RenameBoardUpdate,
  RenameColumnUpdate,
  RenameSubtaskUpdate,
  RenameTaskUpdate,
  SwitchTaskColumnUpdate,
  ToggleSubtaskUpdate,
  ToggleTaskUpdate,
  Update,
} from "~/types/updates";

// ------ Board ------
export async function getBoards() {
  const user = auth();
  if (!user.userId) return [];
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
  return boards;
}

export const handleCreateBoard = async ({
  change,
  userId,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: CreateBoardUpdate;
  userId: string;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    const { payload } = change;
    const { board } = payload;
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
        result.error.issues[0]?.message ?? "Error while creating a new board",
      );
    }

    await tx.update(boards).set({ current: false });
    await tx.insert(boards).values(board);
  } catch (error) {
    const errorMessage =
      error === "string" ? error : "Error while creating a new board";
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
  change,
  userId,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: RenameBoardUpdate;
  userId: string;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { boardId, newBoardName } = payload;

  const result = BoardSchema.pick({ id: true, name: true }).safeParse({
    id: boardId,
    name: newBoardName,
  });
  if (!result.success) {
    throw new Error(
      result.error.issues[0]?.message ?? "Error while renaming a board",
    );
  }

  try {
    await tx
      .update(boards)
      .set({ name: newBoardName, updatedAt: new Date() })
      .where(and(eq(boards.id, boardId), eq(boards.userId, userId)));
  } catch (error) {
    const errorMessage =
      error === "string" ? error : "Error while renaming board";
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
  change,
  userId,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: DeleteBoardUpdate;
  userId: string;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { boardId, boardIndex, wasCurrent } = payload;

  const result = BoardSchema.pick({ id: true, index: true }).safeParse({
    id: boardId,
    index: boardIndex,
  });

  if (!result.success) {
    throw new Error(
      result.error.issues[0]?.message ?? "Error while deleting a board",
    );
  }

  try {
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
      error === "string" ? error : "Error while deleting board";
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
  change,
  userId,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: MakeBoardCurrentUpdate;
  userId: string;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { oldCurrentBoardId, newCurrentBoardId } = payload;
  try {
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
      error === "string" ? error : "Error while making board current";
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
  change,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: CreateColumnUpdate;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { column } = payload;
  const { boardId } = column;

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

  try {
    await tx.insert(columns).values(column);
  } catch (error) {
    const errorMessage =
      error === "string" ? error : "Error while creating column";
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
  change,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: RenameColumnUpdate;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { columnId, newColumnName } = payload;

  const result = ColumnSchema.pick({ id: true, name: true }).safeParse({
    id: columnId,
    name: newColumnName,
  });
  if (!result.success) {
    throw new Error("Error while renaming a column");
  }

  try {
    await tx
      .update(columns)
      .set({ name: newColumnName, updatedAt: new Date() })
      .where(and(eq(columns.id, columnId)));
  } catch (error) {
    const errorMessage =
      error === "string" ? error : "Error while renaming column";
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
  change,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: DeleteColumnUpdate;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { boardId, columnId } = payload;

  const result = ColumnSchema.pick({ id: true, boardId: true }).safeParse({
    id: columnId,
    boardId,
  });
  if (!result.success) {
    throw new Error("Error while deleting a column");
  }

  try {
    const column = await tx.query.columns.findFirst({
      where: (model, { eq }) => eq(model.id, columnId),
    });
    if (!column) throw new Error("Column not found");
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
      error === "string" ? error : "Error while deleting column";
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
  change,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: CreateTaskUpdate;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { columnId, task } = payload;

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

  try {
    await tx.insert(tasks).values(task);
  } catch (error) {
    const errorMessage =
      error === "string" ? error : "Error while creating task";
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
  change,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: RenameTaskUpdate;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { taskId, newTaskName } = payload;
  const result = TaskSchema.pick({ id: true, name: true }).safeParse({
    id: taskId,
    name: newTaskName,
  });
  if (!result.success) throw new Error("Error while renaming a task");
  try {
    await tx
      .update(tasks)
      .set({ name: newTaskName, updatedAt: new Date() })
      .where(eq(tasks.id, taskId));
  } catch (error) {
    const errorMessage =
      error === "string" ? error : "Error while renaming task";
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
  change,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: DeleteTaskUpdate;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { taskId } = payload;

  const result = TaskSchema.pick({ id: true }).safeParse({ id: taskId });
  if (!result.success) throw new Error("Error while deleting a task");

  try {
    const task = await tx.query.tasks.findFirst({
      where: (model, { eq }) => eq(model.id, taskId),
    });
    if (!task) throw new Error("Task not found");
    await tx
      .update(tasks)
      .set({ index: sql`${tasks.index} - 1` })
      .where(
        and(eq(tasks.columnId, task.columnId), gt(tasks.index, task.index)),
      );
    await tx.delete(tasks).where(eq(tasks.id, taskId));
  } catch (error) {
    const errorMessage =
      error === "string" ? error : "Error while deleting task";
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
  change,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: ToggleTaskUpdate;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { taskId } = payload;

  const result = TaskSchema.pick({ id: true }).safeParse({ id: taskId });
  if (!result.success) throw new Error("Error while toggling a task");

  try {
    const task = await tx.query.tasks.findFirst({
      where: (model, { eq }) => eq(model.id, taskId),
    });

    if (!task) throw new Error("Task not found!");

    await tx
      .update(tasks)
      .set({ completed: !task.completed, updatedAt: new Date() })
      .where(eq(tasks.id, taskId));
  } catch (error) {
    const errorMessage =
      error === "string" ? error : "Error while toggling task";
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
  change,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: SwitchTaskColumnUpdate;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
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

  try {
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
      error === "string" ? error : "Error while switching task column";
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
  change,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: CreateSubtaskUpdate;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { subtask } = payload;

  const result = SubtaskSchema.safeParse(subtask);
  if (!result.success) throw new Error("Error while creating a subtask");

  try {
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
      error === "string" ? error : "Error while creating a subtask";
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
  change,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: RenameSubtaskUpdate;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { newSubtaskName, subtaskId } = payload;

  const result = SubtaskSchema.pick({ id: true, name: true }).safeParse({
    id: subtaskId,
    name: newSubtaskName,
  });
  if (!result.success) throw new Error("Error while renaming subtask");

  try {
    await tx
      .update(subtasks)
      .set({ name: newSubtaskName, updatedAt: new Date() })
      .where(eq(subtasks.id, subtaskId));
  } catch (error) {
    const errorMessage =
      error === "string" ? error : "Error while renaming subtask";
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
  change,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: DeleteSubtaskUpdate;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { subtaskId } = payload;

  const result = SubtaskSchema.pick({ id: true }).safeParse({ id: subtaskId });
  if (!result.success) throw new Error("Error while deleting a subtask");

  try {
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
      error === "string" ? error : "Error while deleting subtask";
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
  change,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: ToggleSubtaskUpdate;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { payload } = change;
  const { subtaskId } = payload;

  const result = SubtaskSchema.pick({ id: true }).safeParse({ id: subtaskId });
  if (!result.success) throw new Error("Error while togglingh a subtask");

  try {
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
      error === "string" ? error : "Error while toggling subtask";
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
export async function mutateTable(changes: Update[]) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  try {
    await db.transaction(async (tx) => {
      for (const change of changes) {
        switch (change.action) {
          // Boards
          case "createBoard":
            await handleCreateBoard({
              change,
              userId: user.userId,
              tx,
              inTransaction: true,
            });
            break;
          case "renameBoard":
            await handleRenameBoard({
              change,
              userId: user.userId,
              tx,
              inTransaction: true,
            });
            break;
          case "deleteBoard":
            await handleDeleteBoard({
              change,
              userId: user.userId,
              tx,
              inTransaction: true,
            });
            break;
          case "makeBoardCurrent":
            await handleMakeBoardCurrent({
              change,
              userId: user.userId,
              tx,
              inTransaction: true,
            });
            break;

          // Columns
          case "createColumn":
            await handleCreateColumn({ change, tx, inTransaction: true });
            break;
          case "renameColumn":
            await handleRenameColumn({ change, tx, inTransaction: true });
            break;
          case "deleteColumn":
            await handleDeleteColumn({ change, tx, inTransaction: true });
            break;

          // Tasks
          case "createTask":
            await handleCreateTask({ change, tx, inTransaction: true });
            break;
          case "renameTask":
            await handleRenameTask({ change, tx, inTransaction: true });
            break;
          case "deleteTask":
            await handleDeleteTask({ change, tx, inTransaction: true });
            break;
          case "toggleTask":
            await handleToggleTaskCompleted({
              change,
              tx,
              inTransaction: true,
            });
            break;
          case "switchTaskColumn":
            await handleSwitchTaskColumn({ change, tx, inTransaction: true });
            break;

          // Subtasks
          case "createSubtask":
            await handleCreateSubtask({ change, tx, inTransaction: true });
            break;
          case "renameSubtask":
            await handleRenameSubtask({ change, tx, inTransaction: true });
            break;
          case "deleteSubtask":
            await handleDeleteSubtask({ change, tx, inTransaction: true });
            break;
          case "toggleSubtask":
            await handleToggleSubtaskCompleted({
              change,
              tx,
              inTransaction: true,
            });
            break;

          // DEFAULT
          default:
            throw new Error(`Unknown action`);
        }
      }
    });
    revalidatePath("/");
  } catch (error) {
    return { error: error ?? "Transaction error" };
  }
}
