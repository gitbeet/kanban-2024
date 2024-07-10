"use client";

import React, { useOptimistic, useRef } from "react";
import { type TaskType, type ColumnType } from "../types";
import Task from "../components/task";
import SubmitButton from "./ui/submit-button";
import { v4 as uuid } from "uuid";
import {
  createTaskAction,
  deleteColumnAction,
  renameColumnAction,
} from "~/actions";
const Column = ({
  column,
  setOptimistic,
}: {
  column: ColumnType;
  setOptimistic: (action: {
    action: "create" | "rename" | "delete";
    column: ColumnType;
  }) => void;
}) => {
  const renameColumnRef = useRef<HTMLFormElement>(null);
  const createTaskRef = useRef<HTMLFormElement>(null);
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    column.tasks,
    (
      state,
      {
        action,
        task,
      }: { action: "create" | "rename" | "delete" | "toggle"; task: TaskType },
    ) => {
      if (action === "create") return [...state, task];
      if (action === "rename")
        return state.map((t) => (t.id === task.id ? task : t));
      if (action === "delete") return state.filter((t) => t.id !== task.id);
      if (action === "toggle")
        return state.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t,
        );
      // default case?
      return state;
    },
  );

  return (
    <div key={column.id} className="border p-4">
      <p className="pb-4 text-lg font-bold">{column.name}</p>
      {/* Delete column */}
      <form
        action={async (formData: FormData) => {
          setOptimistic({ action: "delete", column });
          await deleteColumnAction(formData);
        }}
      >
        <input type="hidden" name="column-id" value={column.id} />
        <SubmitButton text="Delete column" />
      </form>
      {/* Rename column */}
      <form
        ref={renameColumnRef}
        action={async (formData: FormData) => {
          const name = formData.get("column-name-input") as string;
          const renamedColumn = { ...column, name };
          setOptimistic({ action: "rename", column: renamedColumn });
          await renameColumnAction(formData);
        }}
      >
        <input type="hidden" name="column-id" value={column.id} />
        <input type="text" name="column-name-input" />
        <SubmitButton text="Rename column" />
      </form>
      <form
        ref={createTaskRef}
        action={async (formData) => {
          createTaskRef.current?.reset();
          const newTask: TaskType = {
            id: uuid(),
            name: formData.get("task-name-input") as string,
            columnId: column.id,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setOptimisticTasks({ action: "create", task: newTask });
          await createTaskAction(formData);
        }}
      >
        <input type="hidden" name="column-id" value={column.id} />
        <input
          type="text"
          name="task-name-input"
          placeholder="New name for task..."
        />
        <SubmitButton text="Create task" pendingText="Creating..." />
      </form>
      <div>
        <h4 className="pb-4 font-bold">Tasks</h4>
        {optimisticTasks.map((task) => (
          <Task key={task.id} task={task} setOptimistic={setOptimisticTasks} />
        ))}
      </div>
    </div>
  );
};

export default Column;
