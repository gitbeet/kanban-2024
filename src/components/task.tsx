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

import DropIndicator from "./drop-indicator";
import { motion } from "framer-motion";
import RenameTaskForm from "./action-forms/task/rename-task-form";
import DeleteTaskForm from "./action-forms/task/delete-task-form";
import ToggleTaskForm from "./action-forms/task/toggle-task-form";

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
        <ToggleTaskForm
          board={board}
          column={column}
          task={task}
          setOptimistic={setOptimistic}
        />
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
