"use client";

import React, { useEffect, useState } from "react";
import { useBoards } from "~/context/boards-context";
import { v4 as uuid } from "uuid";
import { mutateTable } from "~/server/queries";
import { SubtaskSchema, TaskSchema } from "~/zod-schemas";
import type { ChangeEvent } from "react";
import type { SubtaskType, Change, TaskType } from "~/types";
import InputField from "~/components/ui/input-field";
import {
  Button,
  CloseButton,
  DeleteButton,
} from "~/components/ui/button/buttons";
import { ModalWithBackdrop } from "~/components/ui/modal/modal";
import PromptWindow from "~/components/ui/modal/prompt-window";
import { useUI } from "~/context/ui-context";
import {
  CreateSubtaskUpdate,
  RenameSubtaskUpdate,
  RenameTaskUpdate,
  SwitchTaskColumnUpdate,
  Update,
} from "~/types/updates";

interface Props {
  task: TaskType;
  columnId: string;
}

export const EditTaskMenu = ({ columnId, task }: Props) => {
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
    showEditTaskWindow,
    setShowEditTaskWindow,
    setShowEditTaskSmallMenu,
    setShowEditTaskMenu,
  } = useUI();
  const { getCurrentBoard } = useBoards();
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
  const [changes, setChanges] = useState<Update[]>([]);

  useEffect(() => {
    setTemporaryName(task.name);
    setTemporarySubtasks(task.subtasks);
  }, [task]);

  const handleResetChanges = () => {
    setTemporarySubtasks(task.subtasks);
    setTemporaryColumnId(columnId);
    setTemporaryName(task.name);
    setLoading(false);
    setChanges([]);
    setError({ name: "", subtasks: initialSubtaskErrors });
  };

  const handleCloseAllWindows = () => {
    setShowConfirmCancelWindow(false);
    setShowEditTaskWindow(false);
    setShowEditTaskSmallMenu(false);
    setShowEditTaskMenu(false);
    handleResetChanges();
  };

  const handleCloseTaskEditWindow = () => {
    setShowConfirmCancelWindow(false);
    setShowEditTaskWindow(false);
    handleResetChanges();
  };

  const handleChangeTaskName = (e: ChangeEvent<HTMLInputElement>) => {
    if (!board) return;
    setError((prev) => ({ ...prev, name: "" }));
    setTemporaryName(e.target.value);
    setChanges((prev) => {
      const actionIndex = prev.findIndex(
        (change) =>
          change.action === "renameTask" && change.payload.taskId === task.id,
      );
      // If there's already a rename action, don't add another one
      if (actionIndex !== -1) {
        return prev.map((change, i) =>
          i === actionIndex
            ? ({
                ...change,
                payload: { ...change.payload, newTaskName: e.target.value },
              } as RenameTaskUpdate)
            : change,
        );
      } else {
        return [
          ...prev,
          {
            action: "renameTask",
            payload: {
              boardId: board.id,
              columnId: columnId,
              taskId: task.id,
              newTaskName: e.target.value,
            },
          } satisfies RenameTaskUpdate,
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
        return prev.filter((change) => change.action !== "switchTaskColumn");
      const actionIndex = prev.findIndex(
        (change) => change.action === "switchTaskColumn",
      );
      // If action already exists
      if (actionIndex !== -1) {
        return prev.map((change, i) =>
          i === actionIndex
            ? ({
                ...change,
                payload: { ...change.payload, newColumnId: e.target.value },
              } as SwitchTaskColumnUpdate)
            : change,
        );
      }

      const newColumnIndex =
        (board?.columns.find((col) => col.id === e.target.value)?.tasks
          .length ?? 0) + 1;

      return [
        ...prev,
        {
          action: "switchTaskColumn",
          payload: {
            boardId: board.id,
            taskId: task.id,
            oldColumnId: task.columnId,
            newColumnId: e.target.value,
            oldColumnIndex: task.index,
            newColumnIndex: newColumnIndex,
          },
        } satisfies SwitchTaskColumnUpdate,
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
        (change) =>
          change.action === "createSubtask" &&
          change.payload.subtask.id === newSubtask.id,
      );
      // If action already exists
      if (actionIndex !== -1) {
        return prev;
      } else {
        return [
          ...prev,
          {
            action: "createSubtask",
            payload: {
              boardId: board.id,
              columnId,
              subtask: newSubtask,
              taskId: task.id,
            },
          } satisfies CreateSubtaskUpdate,
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
        (change) =>
          change.action === "createSubtask" &&
          change.payload.subtask.id === subtaskId,
      );

      const subtaskRenameActionIndex = prev.findIndex(
        (change) =>
          change.action === "renameSubtask" &&
          change.payload.subtaskId === subtaskId,
      );

      if (subtaskAddActionIndex !== -1) {
        return prev.map((change) =>
          change.action === "createSubtask" &&
          change.payload.subtask.id === subtaskId
            ? {
                ...change,
                payload: {
                  ...change.payload,
                  subtask: { ...change.payload.subtask, name: e.target.value },
                },
              }
            : change,
        );
      } else if (subtaskRenameActionIndex !== -1) {
        return prev.map((change, i) =>
          i === subtaskRenameActionIndex
            ? ({
                ...change,
                payload: { ...change.payload, newSubtaskName: e.target.value },
              } as RenameSubtaskUpdate)
            : change,
        );
      } else {
        return [
          ...prev,
          {
            action: "renameSubtask",
            payload: {
              boardId: board.id,
              columnId,
              taskId: task.id,
              subtaskId,
              newSubtaskName: e.target.value,
            },
          } satisfies RenameSubtaskUpdate,
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
          (change) =>
            change.action === "createSubtask" &&
            change.payload.subtask.id === subtaskId,
        ) !== -1;
      const actionIndex = prev.findIndex(
        (change) =>
          change.action === "deleteSubtask" &&
          change.payload.subtaskId === subtaskId,
      );
      // If it was added since the menu was opened -> clear all actions that have to do with said subtask (if we added it , renamed it then deleted it before saving the changes it means we don't query the db at all )
      if (wasAdded) {
        return prev.filter((change) => {
          if (change.action === "renameSubtask") {
            return change.payload.subtaskId !== subtaskId;
          }
          if (change.action === "createSubtask") {
            return change.payload.subtask.id !== subtaskId;
          }
          return true;
        });
      }

      if (actionIndex !== -1 && !wasAdded) {
        return prev;
      } else {
        // If we still don't have a action entry for the delete of this subtask and we haven't added it since the menu was opened -> add the delete action entry and remove the rename (we don't need to rename the task if we are to delete it in the same query)
        return [
          ...prev.filter((change) => {
            if (change.action === "renameSubtask") {
              return change.payload.subtaskId !== subtaskId;
            }
            return true;
          }),
          {
            action: "deleteSubtask",
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
    setLoading(true);
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

    const response = await mutateTable(changes);
    if (response?.error) {
      return console.log(response.error);
    }
    setLoading(false);
    handleCloseAllWindows();
  };

  const handleShowConfirmationWindow = () => {
    if (!changes.length) return handleCloseTaskEditWindow();
    setShowConfirmCancelWindow(true);
  };

  const confirmCancelWindowJSX = (
    <>
      <PromptWindow
        zIndex={50}
        show={showConfirmCancelWindow}
        showBackdrop={showEditTaskWindow && showConfirmCancelWindow}
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
        show={showEditTaskWindow}
        showBackdrop={
          showEditTaskSmallMenu && showEditTaskMenu && showEditTaskWindow
        }
        onClose={handleShowConfirmationWindow}
      >
        <div className="text-dark relative space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">Edit Task</h1>
            <CloseButton onClick={handleShowConfirmationWindow} />
          </div>
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
            />
          </div>
          {/* -----  ----- */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Subtasks</h3>
            <ul className="space-y-2.5">
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
              loading={loading}
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
