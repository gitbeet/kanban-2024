"use client";

import React, { useRef } from "react";
import { type TaskType, type ColumnType, type BoardType } from "../types";
import Task from "../components/task";
import SubmitButton from "./ui/submit-button";
import { v4 as uuid } from "uuid";
import {
  createTaskAction,
  deleteColumnAction,
  renameColumnAction,
} from "~/actions";
const Column = ({
  board,
  column,
  setOptimistic,
}: {
  board: BoardType;
  column: ColumnType;
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
    board?: BoardType;
    column?: ColumnType;
    task?: TaskType;
    oldColumnId?: string;
    newColumnId?: string;
    newColumnIndex?: number;
  }) => void;
}) => {
  const renameColumnRef = useRef<HTMLFormElement>(null);
  const createTaskRef = useRef<HTMLFormElement>(null);

  return (
    <div key={column.id} className="border p-4">
      <div className="flex gap-4">
        <h3 className="pb-4 text-lg font-bold">Column name: {column.name}</h3>
        {/* Delete column */}
        <form
          action={async (formData: FormData) => {
            setOptimistic({ action: "deleteColumn", board, column });
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
            const renamedColumn: ColumnType = {
              ...column,
              name,
              updatedAt: new Date(),
            };
            setOptimistic({
              action: "renameColumn",
              board,
              column: renamedColumn,
            });
            await renameColumnAction(formData);
          }}
        >
          <input type="hidden" name="column-id" value={column.id} />
          <input type="text" name="column-name-input" />
          <SubmitButton text="Rename column" />
        </form>
      </div>

      <div>
        <h4 className="pb-4 font-bold">Tasks</h4>
        {column.tasks
          .sort((a, b) => a.index - b.index)
          .map((task) => (
            <Task
              key={task.index}
              board={board}
              column={column}
              task={task}
              setOptimistic={setOptimistic}
            />
          ))}
      </div>
      <form
        className="space-x-2 pt-8"
        ref={createTaskRef}
        action={async (formData) => {
          const maxIndex = Math.max(...column.tasks.map((t) => t.index));

          createTaskRef.current?.reset();
          const newTask: TaskType = {
            id: uuid(),
            index: maxIndex + 1,
            name: formData.get("task-name-input") as string,
            columnId: column.id,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setOptimistic({ action: "createTask", board, column, task: newTask });
          await createTaskAction(formData);
        }}
      >
        <input type="hidden" name="column-id" value={column.id} />
        <input
          type="text"
          name="task-name-input"
          placeholder="New name for task..."
        />
        <SubmitButton text="Add task" pendingText="Creating..." />
      </form>
    </div>
  );
};

export default Column;
