"use server";

import { db } from "./db/index";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import type { Action } from "~/types/actions";
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
import { handleCreateSubtask } from "./server-actions/subtask/create-subtask";
import { handleRenameSubtask } from "./server-actions/subtask/rename-subtask";
import { handleDeleteSubtask } from "./server-actions/subtask/delete-subtask";
import { handleToggleSubtaskCompleted } from "./server-actions/subtask/toggle-subtask";

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
