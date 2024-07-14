/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-types */
"use client";

import React, { useRef } from "react";
import type {
  SetOptimisticType,
  BoardType,
  ColumnType,
  TaskType,
} from "../types";
import SubmitButton, { DeleteButton, EditButton } from "./ui/submit-button";
import {
  deleteTaskAction,
  renameTaskAction,
  switchColumnAction,
  toggleTaskCompletedAction,
} from "~/actions";
import DropIndicator from "./drop-indicator";
import { motion } from "framer-motion";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";

const Task = ({
  board,
  column,
  task,
  setOptimistic,
  handleDragStart,
}: {
  board: BoardType;
  column: ColumnType;
  task: TaskType;
  setOptimistic: SetOptimisticType;
  handleDragStart: Function;
}) => {
  const renameTaskRef = useRef<HTMLFormElement>(null);

  const renameTaskActionForm = (
    <form
      className="flex"
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
      <input type="text" name="task-name-input" placeholder="New name..." />
      <input type="hidden" name="task-id" value={task.id} />
      <EditButton />
    </form>
  );

  const deleteTaskActionForm = (
    <form
      action={async (formData) => {
        setOptimistic({
          action: "deleteTask",
          board: board,
          columnId: column.id,
          taskId: task.id,
          taskIndex: task.index.toString(),
        });

        await deleteTaskAction(formData);
      }}
    >
      <input type="hidden" name="task-id" value={task.id} />
      <DeleteButton />
    </form>
  );

  const toggleTaskActionForm = (
    <form
      action={async (formData) => {
        setOptimistic({ action: "toggleTask", board, column, task });
        await toggleTaskCompletedAction(formData);
      }}
    >
      <input type="hidden" name="task-id" value={task.id} />
      <input
        readOnly
        type="hidden"
        name="task-completed"
        checked={task.completed ? true : false}
        value={task.completed ? "true" : "false"}
      />
      <SubmitButton
        icon={
          <div className="flex h-3 w-3 items-center justify-center">
            {task.completed ? <FaCheck /> : undefined}
          </div>
        }
      />
    </form>
  );

  return (
    <>
      <DropIndicator
        beforeId={task.id}
        beforeIndex={String(task.index)}
        columnId={task.columnId}
      />
      <motion.div
        layout
        layoutId={task.id}
        onDragStart={(e) => handleDragStart(e, task, column.id)}
        draggable
        className="flex cursor-grab items-center gap-4 border p-4"
      >
        {toggleTaskActionForm}
        <p className="w-32 text-xl">{task.name}</p>
        {renameTaskActionForm}
        {deleteTaskActionForm}
      </motion.div>
    </>
  );
};

export default Task;
