import React from "react";
import { type ColumnType } from "../types";
import Task from "../components/task";
const Column = ({ column }: { column: ColumnType }) => {
  return (
    <div key={column.id}>
      <p className="border-b p-2">{column.name}</p>
      <div>
        {column.tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
