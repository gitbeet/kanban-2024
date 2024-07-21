"use client";

import React from "react";
import type { TaskType } from "~/types";
import CreateSubtaskForm from "../action-forms/subtask/create-subtask-form";
import DeleteSubtaskForm from "../action-forms/subtask/delete-subtask-form";
import RenameSubtaskForm from "../action-forms/subtask/rename-subtask-form";
import ToggleSubtaskForm from "../action-forms/subtask/toggle-subtask-form";
import DeleteTaskForm from "../action-forms/task/delete-task-form";
import { createPortal } from "react-dom";
import { useUI } from "~/context/ui-context";
import useHasMounted from "~/hooks/useHasMounted";

const EditTask = ({ columnId, task }: { columnId: string; task: TaskType }) => {
  const { showEditTaskMenu, setEditedTask, setShowEditTaskMenu } = useUI();
  const hasMounted = useHasMounted();
  const handleClickOutside = () => {
    setEditedTask({ columnId: null, taskId: null });
    setShowEditTaskMenu(false);
  };
  const jsx = (
    <>
      <div
        className={`absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 border bg-neutral-600 p-4 ${showEditTaskMenu ? "opacity-100" : "pointer-events-none opacity-0"} `}
      >
        <p className="flex gap-2">
          <span className="w-max"> Delete task - </span>{" "}
          <DeleteTaskForm columnId={columnId} taskId={task.id} />
        </p>
        <p className="flex gap-2">
          <span className="w-max">Create subtask - </span>
          <CreateSubtaskForm columnId={columnId} taskId={task.id} />
        </p>

        <ul>
          {task.subtasks
            .sort((a, b) => a.index - b.index)
            .map((subtask) => (
              <li key={subtask.index} className="flex">
                <span className={subtask.completed ? "line-through" : ""}>
                  {subtask.name}
                </span>
                <DeleteSubtaskForm
                  columnId={columnId}
                  taskId={task.id}
                  subtaskId={subtask.id}
                />
                <RenameSubtaskForm
                  columnId={columnId}
                  taskId={task.id}
                  subtaskId={subtask.id}
                />
                <ToggleSubtaskForm
                  columnId={columnId}
                  taskId={task.id}
                  subtask={subtask}
                />
              </li>
            ))}
        </ul>
      </div>
      <div
        onClick={handleClickOutside}
        className="absolute inset-0 z-10 h-screen w-screen bg-black/30"
      />
    </>
  );

  return hasMounted
    ? createPortal(jsx, document.getElementById("modal-root")!)
    : null;
};

export default EditTask;
