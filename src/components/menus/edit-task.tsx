"use client";

import React, { useEffect, useState } from "react";
import useHasMounted from "~/hooks/useHasMounted";
import useClickOutside from "~/hooks/useClickOutside";
import { useBoards } from "~/context/boards-context";
import { createPortal } from "react-dom";
import { v4 as uuid } from "uuid";
import { mutateTable } from "~/server/queries";
import InputField from "../ui/input-field";
import { Button, DeleteButton } from "../ui/buttons";
import { SubtaskSchema, TaskSchema } from "~/zod-schemas";
import type { ChangeEvent } from "react";
import type { SubtaskType, TaskChange, TaskType } from "~/types";

export const EditTaskWindow = ({
  show,
  onClose,
  columnId,
  task,
}: {
  show: boolean;
  onClose: () => void;
  columnId: string;
  task: TaskType;
}) => {
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

  const hasMounted = useHasMounted();
  const { ref: clickOutsideRef } = useClickOutside<HTMLDivElement>(onClose);

  const { getCurrentBoard } = useBoards();
  const board = getCurrentBoard();

  const [temporaryTaskName, setTemporaryName] = useState(task.name);
  const [temporarySubtasks, setTemporarySubtasks] = useState<
    { id: string; index: number; name: string }[]
  >(initialTemporarySubtasks);
  const [temporaryColumnId, setTemporaryColumnId] = useState(columnId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    name: string;
    subtasks: { id: string; errorMessage: string }[];
  }>({ name: "", subtasks: initialSubtaskErrors });

  // Changes are used for the db transaction query
  const [changes, setChanges] = useState<TaskChange[]>([]);
  useEffect(() => console.log(changes), [changes]);

  const handleCloseWindow = () => {
    setChanges([]);
    setError({ name: "", subtasks: [] });
    onClose();
  };

  const handleChangeTaskName = (e: ChangeEvent<HTMLInputElement>) => {
    setTemporaryName(e.target.value);
    setChanges((prev) => {
      const actionIndex = prev.findIndex(
        (change) => change.action === "renameTask" && change.taskId === task.id,
      );
      // If there's already a rename action, don't add another one
      if (actionIndex !== -1) {
        return prev.map((change, i) =>
          i === actionIndex
            ? { ...change, newTaskName: e.target.value }
            : change,
        );
      } else {
        return [
          ...prev,
          {
            action: "renameTask",
            taskId: task.id,
            // use e.target.value as state updates async and can be one letter behind
            newTaskName: e.target.value,
          },
        ];
      }
    });
  };

  const handleChangeTaskColumn = (e: ChangeEvent<HTMLSelectElement>) => {
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
            ? { ...change, newColumnId: e.target.value }
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
          taskId: task.id,
          oldColumnId: task.columnId,
          newColumnId: e.target.value,
          oldColumnIndex: task.index,
          newColumnIndex: newColumnIndex,
        },
      ];
    });
  };

  const handlecreateSubtask = () => {
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
          change.newSubtask.id === newSubtask.id,
      );
      // If action already exists
      if (actionIndex !== -1) {
        return prev;
      } else {
        return [
          ...prev,
          {
            action: "createSubtask",
            newSubtask,
          },
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
    setTemporarySubtasks((prev) =>
      prev.map((s) =>
        s.id === subtaskId ? { ...s, name: e.target.value } : s,
      ),
    );
    setChanges((prev) => {
      const subtaskAddActionIndex = prev.findIndex(
        (change) =>
          change.action === "createSubtask" &&
          change.newSubtask.id === subtaskId,
      );

      const subtaskRenameActionIndex = prev.findIndex(
        (change) =>
          change.action === "renameSubtask" && change.subtaskId === subtaskId,
      );

      if (subtaskAddActionIndex !== -1) {
        return prev.map((change) =>
          change.action === "createSubtask" &&
          change.newSubtask.id === subtaskId
            ? {
                ...change,
                newSubtask: { ...change.newSubtask, name: e.target.value },
              }
            : change,
        );
      } else if (subtaskRenameActionIndex !== -1) {
        return prev.map((change, i) =>
          i === subtaskRenameActionIndex
            ? { ...change, newSubtaskName: e.target.value }
            : change,
        );
      } else {
        return [
          ...prev,
          {
            action: "renameSubtask",
            subtaskId,
            newSubtaskName: e.target.value,
          },
        ];
      }
    });
  };

  const handleDeleteSubtask = (subtaskId: string, subtaskIndex: number) => {
    setChanges((prev) => {
      // Check if the subtask was added since the menu was opened
      const wasAdded =
        changes.findIndex(
          (change) =>
            change.action === "createSubtask" &&
            change.newSubtask?.id === subtaskId,
        ) !== -1;
      const actionIndex = prev.findIndex(
        (change) =>
          change.action === "deleteSubtask" && change.subtaskId === subtaskId,
      );
      // If it was added since the menu was opened -> clear all actions that have to do with said subtask (if we added it , renamed it then deleted it before saving the changes it means we don't query the db at all )
      if (wasAdded) {
        return prev.filter((change) => {
          if (change.action === "renameSubtask") {
            return change.subtaskId !== subtaskId;
          }
          if (change.action === "createSubtask") {
            return change.newSubtask.id !== subtaskId;
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
              return change.subtaskId !== subtaskId;
            }
            return true;
          }),
          {
            action: "deleteSubtask",
            subtaskId,
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
    if (!changes.length) return onClose();
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
      console.log(response.error);
    }
    setLoading(false);
    handleCloseWindow();
  };

  const jsx = (
    <div
      ref={clickOutsideRef}
      className={` ${show ? "opacity-100" : "pointer-events-none opacity-0"} absolute left-[50dvw] top-[50dvh] z-50 min-w-64 -translate-x-1/2 -translate-y-1/2 space-y-4 border bg-neutral-600 p-6`}
    >
      <h1>Edit Task</h1>
      {/* ----- */}
      <label htmlFor="task-title">Title</label>
      <InputField
        error={error.name}
        value={temporaryTaskName}
        onChange={handleChangeTaskName}
      />
      {/* ----- */}
      <h3>Subtasks</h3>
      <ul className="space-y-2">
        {temporarySubtasks.map((subtask) => {
          const errorIndex = error.subtasks.findIndex(
            (s) => s.id === subtask.id,
          );
          return (
            <div key={subtask.index} className="flex items-center">
              <InputField
                value={subtask.name}
                error={error.subtasks[errorIndex]?.errorMessage ?? ""}
                onChange={(e) => handleChangeSubtaskName(e, subtask.id)}
              />
              <DeleteButton
                type="button"
                onClick={() => handleDeleteSubtask(subtask.id, subtask.index)}
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
      {/* ----- */}
      <h3>Column</h3>
      <select
        value={temporaryColumnId}
        onChange={handleChangeTaskColumn}
        className="w-full bg-neutral-900 px-1 py-2 text-white"
      >
        {board?.columns.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <Button
        loading={loading}
        type="button"
        variant="primary"
        className="w-full"
        onClick={handleSaveChanges}
      >
        Save changes
      </Button>
    </div>
  );
  return hasMounted
    ? createPortal(jsx, document.getElementById("modal-root")!)
    : null;
};
