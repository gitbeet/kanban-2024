"use client";

import { startTransition, useEffect, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { v4 as uuid } from "uuid";
import { mutateTable } from "~/server/queries";
import { SubtaskSchema, TaskSchema } from "~/zod-schemas";
import type { ChangeEvent } from "react";
import type { SubtaskType, TaskType } from "~/types";
import InputField from "~/components/ui/input-field";
import {
  Button,
  CloseButton,
  DeleteButton,
} from "~/components/ui/button/buttons";
import { ModalWithBackdrop } from "~/components/ui/modal/modal";
import PromptWindow from "~/components/ui/modal/prompt-window";
import { useUI } from "~/context/ui-context";
import type {
  CreateSubtaskAction,
  RenameSubtaskAction,
  RenameTaskAction,
  SwitchTaskColumnAction,
  Action,
} from "~/types/actions";

interface Props {
  task: TaskType;
  columnId: string;
}

export const EditTaskAdvanced = ({ columnId, task }: Props) => {
  // Initial state values
  const initialTemporarySubtasks = task.subtasks.map(({ id, index, name }) => ({
    id,
    index,
    name,
  }));
  const initialSubtaskErrors = [...initialTemporarySubtasks].map((subtask) => ({
    id: subtask.id,
    errorMessage: "",
  }));

  const initialErrors = { name: "", subtasks: initialSubtaskErrors };

  const {
    showEditTaskSmallMenu,
    showEditTaskMenu,
    showEditTaskMenuAdvanced,
    setShowEditTaskMenuAdvanced,
    setShowEditTaskSmallMenu,
    setShowEditTaskMenu,
    setEditedTask,
  } = useUI();
  const { getCurrentBoard, setOptimisticBoards } = useBoards();
  const board = getCurrentBoard();

  const [showConfirmCancelWindow, setShowConfirmCancelWindow] = useState(false);

  const [temporaryTaskName, setTemporaryName] = useState(task.name);
  const [temporarySubtasks, setTemporarySubtasks] = useState<SubtaskType[]>(
    task.subtasks,
  );
  const [temporaryColumnId, setTemporaryColumnId] = useState(columnId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    name: string;
    subtasks: { id: string; errorMessage: string }[];
  }>(initialErrors);

  // Changes are used for the db transaction query
  const [changes, setChanges] = useState<Action[]>([]);

  useEffect(() => {
    setTemporaryName(task.name);
    setTemporarySubtasks(task.subtasks);
  }, [task]);

  const resetState = () => {
    setTemporarySubtasks(task.subtasks);
    setTemporaryColumnId(columnId);
    setTemporaryName(task.name);
    setLoading(false);
    setChanges([]);
    setError({ name: "", subtasks: initialSubtaskErrors });
  };

  const handleCloseAllWindows = () => {
    setShowConfirmCancelWindow(false);
    setShowEditTaskMenuAdvanced(false);
    setShowEditTaskSmallMenu(false);
    setShowEditTaskMenu(false);
    resetState();
  };

  const handleCloseTaskEditWindow = () => {
    setShowConfirmCancelWindow(false);
    setShowEditTaskMenuAdvanced(false);
    resetState();
  };

  const handleChangeTaskName = (e: ChangeEvent<HTMLInputElement>) => {
    if (!board) return;
    setError((prev) => ({ ...prev, name: "" }));
    setTemporaryName(e.target.value);
    setChanges((prev) => {
      const actionIndex = prev.findIndex(
        (action) =>
          action.type === "RENAME_TASK" && action.payload.taskId === task.id,
      );
      // If there's already a rename action, don't add another one
      if (actionIndex !== -1) {
        return prev.map((action, i) =>
          i === actionIndex
            ? ({
                ...action,
                payload: { ...action.payload, newTaskName: e.target.value },
              } as RenameTaskAction)
            : action,
        );
      } else {
        return [
          ...prev,
          {
            type: "RENAME_TASK",
            payload: {
              boardId: board.id,
              columnId: columnId,
              taskId: task.id,
              newTaskName: e.target.value,
            },
          } satisfies RenameTaskAction,
        ];
      }
    });
  };

  const handleChangeTaskColumn = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!board) return;
    setTemporaryColumnId(e.target.value);
    setChanges((prev) => {
      const isSameColumn = task.columnId === e.target.value;
      // if we changed to the column the task is currently in -> remove the action
      if (isSameColumn)
        return prev.filter((action) => action.type !== "SWITCH_TASK_COLUMN");
      const actionIndex = prev.findIndex(
        (action) => action.type === "SWITCH_TASK_COLUMN",
      );
      // If action already exists
      if (actionIndex !== -1) {
        return prev.map((action, i) =>
          i === actionIndex
            ? ({
                ...action,
                payload: { ...action.payload, newColumnId: e.target.value },
              } as SwitchTaskColumnAction)
            : action,
        );
      }

      const newColumnIndex =
        (board?.columns.find((col) => col.id === e.target.value)?.tasks
          .length ?? 0) + 1;

      return [
        ...prev,
        {
          type: "SWITCH_TASK_COLUMN",
          payload: {
            boardId: board.id,
            taskId: task.id,
            oldColumnId: task.columnId,
            newColumnId: e.target.value,
            oldColumnIndex: task.index,
            newColumnIndex: newColumnIndex,
          },
        } satisfies SwitchTaskColumnAction,
      ];
    });
  };

  const handlecreateSubtask = () => {
    if (!board) return;
    const maxIndex = temporarySubtasks.length;

    const newSubtask: SubtaskType = {
      id: uuid(),
      index: maxIndex + 1,
      name: "",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      taskId: task.id,
    };
    // Add the subtask id to the "new" list only if it it's not already there
    setChanges((prev) => {
      const actionIndex = prev.findIndex(
        (action) =>
          action.type === "CREATE_SUBTASK" &&
          action.payload.subtask.id === newSubtask.id,
      );
      // If action already exists
      if (actionIndex !== -1) {
        return prev;
      } else {
        return [
          ...prev,
          {
            type: "CREATE_SUBTASK",
            payload: {
              boardId: board.id,
              columnId,
              subtask: newSubtask,
              taskId: task.id,
            },
          } satisfies CreateSubtaskAction,
        ];
      }
    });

    // Add the subtask
    setTemporarySubtasks((prev) => [...prev, newSubtask]);
    // Add an error object for added subtask
    setError((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, { id: newSubtask.id, errorMessage: "" }],
    }));
  };

  const handleChangeSubtaskName = (
    e: ChangeEvent<HTMLInputElement>,
    subtaskId: string,
  ) => {
    if (!board) return;
    setError((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((s) =>
        s.id === subtaskId ? { ...s, errorMessage: "" } : s,
      ),
    }));

    setTemporarySubtasks((prev) =>
      prev.map((s) =>
        s.id === subtaskId ? { ...s, name: e.target.value } : s,
      ),
    );
    setChanges((prev) => {
      const subtaskAddActionIndex = prev.findIndex(
        (action) =>
          action.type === "CREATE_SUBTASK" &&
          action.payload.subtask.id === subtaskId,
      );

      const subtaskRenameActionIndex = prev.findIndex(
        (action) =>
          action.type === "RENAME_SUBTASK" &&
          action.payload.subtaskId === subtaskId,
      );

      if (subtaskAddActionIndex !== -1) {
        return prev.map((action) =>
          action.type === "CREATE_SUBTASK" &&
          action.payload.subtask.id === subtaskId
            ? {
                ...action,
                payload: {
                  ...action.payload,
                  subtask: { ...action.payload.subtask, name: e.target.value },
                },
              }
            : action,
        );
      } else if (subtaskRenameActionIndex !== -1) {
        return prev.map((action, i) =>
          i === subtaskRenameActionIndex
            ? ({
                ...action,
                payload: { ...action.payload, newSubtaskName: e.target.value },
              } as RenameSubtaskAction)
            : action,
        );
      } else {
        return [
          ...prev,
          {
            type: "RENAME_SUBTASK",
            payload: {
              boardId: board.id,
              columnId,
              taskId: task.id,
              subtaskId,
              newSubtaskName: e.target.value,
            },
          } satisfies RenameSubtaskAction,
        ];
      }
    });
  };

  const handleDeleteSubtask = (subtaskId: string, subtaskIndex: number) => {
    if (!board) return;
    setChanges((prev) => {
      // Check if the subtask was added since the menu was opened
      const wasAdded =
        changes.findIndex(
          (action) =>
            action.type === "CREATE_SUBTASK" &&
            action.payload.subtask.id === subtaskId,
        ) !== -1;
      const actionIndex = prev.findIndex(
        (action) =>
          action.type === "DELETE_SUBTASK" &&
          action.payload.subtaskId === subtaskId,
      );
      // If it was added since the menu was opened -> clear all actions that have to do with said subtask (if we added it , renamed it then deleted it before saving the changes it means we don't query the db at all )
      if (wasAdded) {
        return prev.filter((action) => {
          if (action.type === "RENAME_SUBTASK") {
            return action.payload.subtaskId !== subtaskId;
          }
          if (action.type === "CREATE_SUBTASK") {
            return action.payload.subtask.id !== subtaskId;
          }
          return true;
        });
      }

      if (actionIndex !== -1 && !wasAdded) {
        return prev;
      } else {
        // If we still don't have a action entry for the delete of this subtask and we haven't added it since the menu was opened -> add the delete action entry and remove the rename (we don't need to rename the task if we are to delete it in the same query)
        return [
          ...prev.filter((action) => {
            if (action.type === "RENAME_SUBTASK") {
              return action.payload.subtaskId !== subtaskId;
            }
            return true;
          }),
          {
            type: "DELETE_SUBTASK",
            payload: {
              boardId: board.id,
              columnId,
              taskId: task.id,
              subtaskId,
            },
          },
        ];
      }
    });

    setTemporarySubtasks((prev) =>
      prev
        .map((s) => (s.index > subtaskIndex ? { ...s, index: s.index - 1 } : s))
        .filter((s) => s.id !== subtaskId),
    );
  };

  const handleSaveChanges = async () => {
    // -------------- CLIENT VALIDATION START --------------

    // Use local variable as state changes async and can validate wrongly when errors are present
    let validated = true;

    // Task name  validation
    const nameValidationResult =
      TaskSchema.shape.name.safeParse(temporaryTaskName);
    if (!nameValidationResult.success) validated = false;
    const nameValidationErrorMessage =
      nameValidationResult.error?.issues[0]?.message ?? "";
    setError((prev) => ({ ...prev, name: nameValidationErrorMessage }));

    // Subtask  validations
    temporarySubtasks.forEach((subtask) => {
      const result = SubtaskSchema.shape.name.safeParse(subtask.name);
      if (!result.success) validated = false;
      const errorMessage = result.error?.issues[0]?.message ?? "";
      setError((prev) => ({
        ...prev,
        subtasks: prev.subtasks.map((e) =>
          e.id === subtask.id ? { ...e, errorMessage } : e,
        ),
      }));
    });

    if (!validated) return setLoading(false);
    // -------------- CLIENT VALIDATION END --------------
    // updating editedTask when switching column so the menu does not disappear
    handleCloseAllWindows();
    setEditedTask({ columnId: temporaryColumnId, taskId: task.id });
    startTransition(() => {
      changes.forEach((action) => setOptimisticBoards(action));
    });

    const response = await mutateTable(changes);
    if (response?.error) {
      return console.log(response.error);
    }
  };

  const handleShowConfirmationWindow = () => {
    if (!changes.length) return handleCloseTaskEditWindow();
    setShowConfirmCancelWindow(true);
  };

  const confirmCancelWindowJSX = (
    <>
      <PromptWindow
        zIndex={50}
        show={showConfirmCancelWindow && !!task && !!columnId}
        showBackdrop={showEditTaskMenuAdvanced && showConfirmCancelWindow}
        onClose={() => setShowConfirmCancelWindow(false)}
        message={
          <span>
            Are you sure you want to cancel your changes? All unsaved progress
            will be lost.
          </span>
        }
        confirmButton={
          <Button
            onClick={handleCloseTaskEditWindow}
            type="submit"
            variant="danger"
          >
            Discard Changes
          </Button>
        }
        cancelButton={
          <Button
            onClick={() => setShowConfirmCancelWindow(false)}
            variant="ghost"
          >
            Go Back
          </Button>
        }
      />
    </>
  );

  return (
    <>
      {confirmCancelWindowJSX}
      <ModalWithBackdrop
        zIndex={40}
        show={showEditTaskMenuAdvanced && !!task && !!columnId}
        showBackdrop={
          showEditTaskSmallMenu && showEditTaskMenu && showEditTaskMenuAdvanced
        }
        onClose={handleShowConfirmationWindow}
      >
        {/* p-1 to fix overflow-auto not showing outline on focused elements */}
        <div className="text-dark relative max-h-[95dvh] overflow-auto p-1">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">Edit Task</h1>
            <CloseButton onClick={handleShowConfirmationWindow} />
          </div>
          <div className="h-8" />

          {/* -----  ----- */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold">Title</h4>
            <InputField
              error={error.name}
              value={temporaryTaskName}
              id="task-title"
              onChange={handleChangeTaskName}
              className="w-full"
              errorPlacement="bottom"
              menu
            />
          </div>
          <div className="h-8" />

          {/* -----  ----- */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Subtasks</h3>
            {temporarySubtasks.length === 0 && (
              <p className="text-light text-center">You have no subtasks</p>
            )}
            {/* p-1 to fix overflow-auto not showing outline on focused elements */}
            <ul className="max-h-44 space-y-1 overflow-auto px-1">
              {temporarySubtasks
                .sort((a, b) => a.index - b.index)
                .map((subtask) => {
                  const errorIndex = error.subtasks.findIndex(
                    (s) => s.id === subtask.id,
                  );
                  return (
                    <div
                      key={subtask.index}
                      className="flex items-center gap-2"
                    >
                      <InputField
                        className="w-full"
                        value={subtask.name}
                        error={error.subtasks[errorIndex]?.errorMessage ?? ""}
                        onChange={(e) => handleChangeSubtaskName(e, subtask.id)}
                        errorPlacement="bottom"
                        shiftLayout
                        menu
                      />
                      <DeleteButton
                        className={`${error.subtasks[errorIndex]?.errorMessage ? "relative -top-2.5" : ""}`}
                        type="button"
                        onClick={() =>
                          handleDeleteSubtask(subtask.id, subtask.index)
                        }
                      />
                    </div>
                  );
                })}
            </ul>
            <Button
              variant="primary"
              className="w-full"
              onClick={handlecreateSubtask}
            >
              Add new subtask
            </Button>
          </div>
          <div className="h-8" />
          {/* -----  ----- */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Column</h3>
            <select value={temporaryColumnId} onChange={handleChangeTaskColumn}>
              {board?.columns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="h-8" />

          <div className="space-y-4">
            <Button
              disabled={!changes.length || loading}
              loading={loading}
              type="button"
              variant="primary"
              className="w-full"
              onClick={handleSaveChanges}
            >
              Save changes
            </Button>
            <Button
              type="button"
              variant="danger"
              className="w-full"
              onClick={handleShowConfirmationWindow}
            >
              Cancel
            </Button>
          </div>
        </div>
      </ModalWithBackdrop>
    </>
  );
};
