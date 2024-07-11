"use client";

import React, { useRef } from "react";
import { BoardType, ColumnType, type TaskType } from "../types";
import SubmitButton from "./ui/submit-button";
import {
  deleteTaskAction,
  renameTaskAction,
  switchColumnAction,
  toggleTaskCompletedAction,
} from "~/actions";

const Task = ({
  board,
  column,
  task,
  setOptimistic,
}: {
  board: BoardType;
  column: ColumnType;
  task: TaskType;
  setOptimistic: (action: {
    action:
      | "createBoard"
      | "renameBoard"
      | "deleteBoard"
      | "createColumn"
      | "renameColumn"
      | "deleteColumn"
      | "createTask"
      | "renameTask"
      | "deleteTask"
      | "toggleTask"
      | "switchTaskColumn";
    board: BoardType;
    column?: ColumnType;
    task?: TaskType;
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
          const name = formData.get("task-name-input") as string;
          const renamedTask: TaskType = {
            ...task,
            name,
            updatedAt: new Date(),
          };
          setOptimistic({
            action: "renameTask",
            board,
            column,
            task: renamedTask,
          });
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
          setOptimistic({ action: "deleteTask", board, column, task });
          await deleteTaskAction(formData);
        }}
      >
        <input type="hidden" name="task-id" value={task.id} />
        <SubmitButton text="Delete task" pendingText="Deleting..." />
      </form>
      {/* TOGGLE TASK */}
      <form
        action={async (formData) => {
          setOptimistic({ action: "toggleTask", board, column, task });
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
      {/* SWITCH COLUMN TEST */}
      <form
        action={async (formData: FormData) => {
          const newColumnId = formData.get("new-column-id") as string;
          const switchedTask: TaskType = {
            ...task,
            columnId: newColumnId,
            updatedAt: new Date(),
          };
          setOptimistic({
            action: "switchTaskColumn",
            board,
            column,
            task: switchedTask,
          });
          await switchColumnAction(formData);
        }}
      >
        <input type="hidden" name="task-id" value={task.id} />
        <input
          type="hidden"
          name="new-column-id"
          value="e0f7f82c-7a81-4a2f-9b4b-e185e2a746f7"
        />
        <SubmitButton text="Switch to 2" pendingText="Switching..." />
      </form>
      <form
        action={async (formData: FormData) => {
          const newColumnId = formData.get("new-column-id") as string;
          const switchedTask: TaskType = {
            ...task,
            columnId: newColumnId,
            updatedAt: new Date(),
          };
          setOptimistic({
            action: "switchTaskColumn",
            board,
            column,
            task: switchedTask,
          });
          await switchColumnAction(formData);
        }}
      >
        <input type="hidden" name="task-id" value={task.id} />
        <input
          type="hidden"
          name="new-column-id"
          value="4d20d33e-0398-4cea-b8b5-caba23706eff"
        />
        <SubmitButton text="Switch to 1" pendingText="Switching..." />
      </form>
    </div>
  );
};

export default Task;
