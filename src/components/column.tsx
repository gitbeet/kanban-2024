import React from "react";
import { type ColumnType } from "../types";
import Task from "../components/task";
import { deleteColumn, renameColumn } from "~/server/queries";
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
      <div>
        {column.tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
