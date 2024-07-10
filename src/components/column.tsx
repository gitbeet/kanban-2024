"use client";

import React, { useOptimistic, useRef } from "react";
import { type TaskType, type ColumnType } from "../types";
import Task from "../components/task";
import SubmitButton from "./ui/submit-button";
import { v4 as uuid } from "uuid";
import { createTaskAction } from "~/actions";
const Column = ({ column }: { column: ColumnType }) => {
  const ref = useRef<HTMLFormElement>(null);
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
    <div key={column.id}>
      <p className="border-b p-2">{column.name}</p>
      {/* <form
        action={async () => {
          "use server";
          await renameColumn(column.id, "Rename test");
        }}
      >
        <SubmitButton text="Rename test" />
      </form>
      <form
        action={async () => {
          "use server";
          await deleteColumn(column.id);
        }}
      >
        <SubmitButton text="X" />
      </form>
      <form
        action={async (formData: FormData) => {
          "use server";
          const taskName = formData.get("task-name-input") as string;
          await createTask(column.id, taskName);
        }}
      >
        <input type="text" name="task-name-input" className="text-black" />
        <SubmitButton text="Create task" />
      </form> */}
      <form
        ref={ref}
        action={async (formData) => {
          ref.current?.reset();
          const newTask: TaskType = {
            id: uuid(),
            name: formData.get("task-name-input") as string,
            columnId: column.id,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setOptimisticTasks({ action: "create", task: newTask });
          // renameOptimisticTask(formData.get("task-name-input") as string);
          // const {error} = await renameTaskAction(formData);
          // if(error) {
          //     alert(error)
          // }
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
        {optimisticTasks.map((task) => (
          <Task key={task.id} task={task} setOptimistic={setOptimisticTasks} />
        ))}
      </div>
    </div>
  );
};

export default Column;
