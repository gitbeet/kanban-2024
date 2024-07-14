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
import RenameTaskForm from "./action-forms/task/rename-task-form";
import DeleteTaskForm from "./action-forms/task/delete-task-form";

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
        <RenameTaskForm
          board={board}
          column={column}
          task={task}
          setOptimistic={setOptimistic}
        />
        <DeleteTaskForm
          board={board}
          column={column}
          task={task}
          setOptimistic={setOptimistic}
        />
      </motion.div>
    </>
  );
};

export default Task;
