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
  TaskChange,
  TaskType,
  ToggleSubtaskCompletedChange,
  ToggleTaskCompletedChange,
} from "~/types";
import { BoardSchema } from "~/zod-schemas";

// ------ Board ------
export async function getBoards() {
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
  return boards;
}

export const handleCreateBoard = async ({
  change,
  userId,
  tx = db,
  revalidate = false,
  inTransaction = false,
}: {
  change: CreateBoardChange;
  userId: string;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    const { id, name, oldCurrentBoardId } = change;
    // calculate current max position
    const boardsOrdered = await tx.query.boards.findMany({
      where: (model, { eq }) => eq(model.userId, userId),
      orderBy: (model, { desc }) => desc(model.index),
      limit: 1,
    });
    const maxIndex = boardsOrdered[0]?.index ?? 0;

    if (typeof maxIndex === undefined) throw new Error("No max index");

    const newBoard: BoardType = {
      id,
      name,
      columns: [],
      current: true,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      index: maxIndex + 1,
    };

    const result = BoardSchema.safeParse(newBoard);
    if (!result.success) {
      throw new Error(
        result.error.issues[0]?.message ?? "Error while creating a new board",
      );
    }
    await tx
      .update(boards)
      .set({ current: false })
      .where(and(eq(boards.id, oldCurrentBoardId), eq(boards.userId, userId)));
    await tx.insert(boards).values(newBoard);
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
  change: RenameBoardChange;
  userId: string;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { boardId, newName } = change;
  try {
    await tx
      .update(boards)
      .set({ name: newName, updatedAt: new Date() })
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
  change: DeleteBoardChange;
  userId: string;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { boardId, boardIndex, wasCurrent } = change;
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
  change: MakeBoardCurrentChange;
  userId: string;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { oldCurrentBoardId, newCurrentBoardId } = change;
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
  change: CreateColumnChange;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { boardId, columnName } = change;
  // calculate current max position
  const columnsOrdered = await tx.query.columns.findMany({
    where: (model, { eq }) => eq(model.boardId, boardId),
    orderBy: (model, { desc }) => desc(model.index),
    limit: 1,
  });

  const maxIndex = columnsOrdered[0]?.index ?? 0;

  if (typeof maxIndex === undefined) throw new Error("No max index");

  const newColumn: ColumnType = {
    id: uuid(),
    index: maxIndex + 1,
    tasks: [],
    name: columnName,
    boardId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  try {
    await tx.insert(columns).values(newColumn);
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
  change: RenameColumnChange;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    await tx
      .update(columns)
      .set({ name: change.newName, updatedAt: new Date() })
      .where(and(eq(columns.id, change.columnId)));
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
  change: DeleteColumnChange;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    await tx.delete(columns).where(eq(columns.id, change.columnId));
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
  change: CreateTaskChange;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  const { name, columnId } = change;
  // calculate current max position
  const tasksOrdered = await tx.query.tasks.findMany({
    where: (model, { eq }) => eq(model.columnId, columnId),
    orderBy: (model, { desc }) => desc(model.index),
    limit: 1,
  });
  const maxIndex = tasksOrdered[0]?.index ?? 0;

  if (typeof maxIndex === undefined) throw new Error("No max index");

  const newTask: TaskType = {
    id: uuid(),
    index: maxIndex + 1,
    name,
    completed: false,
    columnId,
    subtasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  try {
    await tx.insert(tasks).values(newTask);
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
  change: RenameTaskChange;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    await tx
      .update(tasks)
      .set({ name: change.newTaskName, updatedAt: new Date() })
      .where(eq(tasks.id, change.taskId));
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
  change: DeleteTaskChange;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    const task = await tx.query.tasks.findFirst({
      where: (model, { eq }) => eq(model.id, change.taskId),
    });
    if (!task) throw new Error("Task not found");
    await tx
      .update(tasks)
      .set({ index: sql`${tasks.index} - 1` })
      .where(
        and(eq(tasks.columnId, task.columnId), gt(tasks.index, task.index)),
      );
    await tx.delete(tasks).where(eq(tasks.id, change.taskId));
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
  change: ToggleTaskCompletedChange;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    const task = await tx.query.tasks.findFirst({
      where: (model, { eq }) => eq(model.id, change.taskId),
    });

    if (!task) throw new Error("Task not found!");

    await tx
      .update(tasks)
      .set({ completed: !task.completed, updatedAt: new Date() })
      .where(eq(tasks.id, change.taskId));
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
  change: SwitchTaskColumnChange;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    const inTheSameColumn = change.oldColumnId === change.newColumnId;
    if (inTheSameColumn) {
      // check which direction we're moving in
      const movingUp = change.oldColumnIndex > change.newColumnIndex;
      if (movingUp) {
        // update the task index
        await tx
          .update(tasks)
          .set({ index: change.newColumnIndex, updatedAt: new Date() })
          .where(eq(tasks.id, change.taskId));
        // Increment all indices between the old and the new, excluding the dragged task's index
        await tx
          .update(tasks)
          .set({ index: sql`${tasks.index} + 1` })
          .where(
            and(
              eq(tasks.columnId, change.newColumnId),
              ne(tasks.id, change.taskId),
              gte(tasks.index, change.newColumnIndex),
              lte(tasks.index, change.oldColumnIndex),
            ),
          );
      } else {
        // update the task index
        await tx
          .update(tasks)
          .set({
            index: change.newColumnIndex - 1,
            updatedAt: new Date(),
          })
          .where(eq(tasks.id, change.taskId));
        // Decrement all indices between the old and the new, excluding the dragged task's index
        await tx
          .update(tasks)
          .set({ index: sql`${tasks.index} - 1` })
          .where(
            and(
              eq(tasks.columnId, change.newColumnId),
              ne(tasks.id, change.taskId),
              gte(tasks.index, change.oldColumnIndex),
              lt(tasks.index, change.newColumnIndex),
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
            eq(tasks.columnId, change.oldColumnId),
            gte(tasks.index, change.oldColumnIndex),
          ),
        );
      await tx
        .update(tasks)
        .set({ index: sql`${tasks.index} + 1` })
        .where(
          and(
            eq(tasks.columnId, change.newColumnId),
            gte(tasks.index, change.newColumnIndex),
          ),
        );

      await tx
        .update(tasks)
        .set({
          columnId: change.newColumnId,
          index: change.newColumnIndex,
        })
        .where(eq(tasks.id, change.taskId));
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
  change: CreateSubtaskChange;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    const subtasksOrdered = await tx.query.subtasks.findMany({
      where: (model, { eq }) => eq(model.taskId, change.newSubtask.taskId),
      orderBy: (model, { desc }) => desc(model.index),
      limit: 1,
    });
    const maxIndex = subtasksOrdered[0]?.index ?? 0;

    if (typeof maxIndex === undefined) throw new Error("No max index");

    const newSubtask: SubtaskType = {
      id: uuid(),
      index: maxIndex + 1,
      name: change.newSubtask.name,
      completed: false,
      taskId: change.newSubtask.taskId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await tx.insert(subtasks).values(newSubtask);
  } catch (error) {
    const errorMessage =
      error === "string" ? error : "Error while creating subtask";
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
  change: RenameSubtaskChange;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    await tx
      .update(subtasks)
      .set({ name: change.newSubtaskName, updatedAt: new Date() })
      .where(eq(subtasks.id, change.subtaskId));
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
  change: DeleteSubtaskChange;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    const subtask = await tx.query.subtasks.findFirst({
      where: (model, { eq }) => eq(model.id, change.subtaskId),
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
    await tx.delete(subtasks).where(eq(subtasks.id, change.subtaskId));
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
  change: ToggleSubtaskCompletedChange;
  tx?: DatabaseType;
  revalidate?: boolean;
  inTransaction?: boolean;
}) => {
  try {
    const subtask = await tx.query.subtasks.findFirst({
      where: (model, { eq }) => eq(model.id, change.subtaskId),
    });

    if (!subtask) throw new Error("Subtask not found!");

    await tx
      .update(subtasks)
      .set({ completed: !subtask.completed, updatedAt: new Date() })
      .where(eq(subtasks.id, change.subtaskId));
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
export async function mutateTable(changes: TaskChange[]) {
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
          case "toggleTaskCompleted":
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
          case "toggleSubtaskCompleted":
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
