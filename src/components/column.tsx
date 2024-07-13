"use client";
import { motion } from "framer-motion";
import React, { useRef } from "react";
import type {
  TaskType,
  ColumnType,
  BoardType,
  SetOptimisticType,
} from "../types";
import Task from "../components/task";
import SubmitButton from "./ui/submit-button";
import { v4 as uuid } from "uuid";
import {
  createTaskAction,
  deleteColumnAction,
  renameColumnAction,
} from "~/actions";
import DropIndicator from "./drop-indicator";
const Column = ({
  board,
  column,
  setOptimistic,
}: {
  board: BoardType;
  column: ColumnType;
  setOptimistic: SetOptimisticType;
}) => {
  const renameColumnRef = useRef<HTMLFormElement>(null);
  const createTaskRef = useRef<HTMLFormElement>(null);

  const handleDragStart = (e: DragEvent, task: TaskType, columnId: string) => {
    e.dataTransfer?.setData("columnId", columnId);
    e.dataTransfer?.setData("taskId", task.id);
    e.dataTransfer?.setData("taskIndex", String(task.index));
  };

  return (
    <div key={column.id} className="p-4">
      <div className="flex gap-4 pb-12">
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
              key={task.id}
              board={board}
              column={column}
              task={task}
              setOptimistic={setOptimistic}
              handleDragStart={handleDragStart}
            />
          ))}
        <DropIndicator beforeId="-1" columnId={column.id} />
      </div>
      <motion.form
        layout
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
      </motion.form>
    </div>
  );
};

export default Column;
