"use client";

import React, { useRef } from "react";
import { type TaskType } from "../types";
import SubmitButton from "./ui/submit-button";
import {
  deleteTaskAction,
  renameTaskAction,
  toggleTaskCompletedAction,
} from "~/actions";

const Task = ({
  task,
  setOptimistic,
}: {
  task: TaskType;
  setOptimistic: (action: {
    action: "create" | "rename" | "delete" | "toggle";
    task: TaskType;
  }) => void;
}) => {
  const renameTaskRef = useRef<HTMLFormElement>(null);

  return (
    <div className="border p-4">
      <p key={task.id}>
        <span className="pr-2">{task.completed ? "(v)" : "(x)"}</span>
        {task.name}
      </p>
      {/* RENAME TASK ACTION */}
      <form
        ref={renameTaskRef}
        action={async (formData) => {
          renameTaskRef.current?.reset();
          const updatedTask = {
            ...task,
            name: formData.get("task-name-input") as string,
          };
          setOptimistic({ action: "rename", task: updatedTask });
          await renameTaskAction(formData);
        }}
      >
        <input
          type="text"
          name="task-name-input"
          placeholder="New name for task..."
        />
        <input type="hidden" name="task-id" value={task.id} />
        <SubmitButton text="Rename task" pendingText="Renaming..." />
      </form>
      {/* DELETE TASK ACTION */}
      <form
        action={async (formData) => {
          setOptimistic({ action: "delete", task });
          await deleteTaskAction(formData);
        }}
      >
        <input type="hidden" name="task-id" value={task.id} />
        <SubmitButton text="Delete task" pendingText="Deleting..." />
      </form>
      {/* TOGGLE TASK */}
      <form
        action={async (formData) => {
          setOptimistic({ action: "toggle", task });
          await toggleTaskCompletedAction(formData);
        }}
      >
        <input type="hidden" name="task-id" value={task.id} />
        <input
          type="hidden"
          name="task-completed"
          value={task.completed ? "true" : "false"}
        />
        <SubmitButton text="Toggle task" pendingText="Toggling..." />
      </form>
    </div>
  );
};

export default Task;
