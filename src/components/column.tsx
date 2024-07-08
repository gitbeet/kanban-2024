import React from "react";
import { type ColumnType } from "../types";
import Task from "../components/task";
import { createTask, deleteColumn, renameColumn } from "~/server/queries";
import SubmitButton from "./ui/submit-button";
const Column = ({ column }: { column: ColumnType }) => {
  return (
    <div key={column.id}>
      <p className="border-b p-2">{column.name}</p>
      <form
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
      </form>
      <div>
        {column.tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
