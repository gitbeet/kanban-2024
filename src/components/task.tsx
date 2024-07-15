/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-types */
"use client";

import type { BoardType, ColumnType, TaskType } from "../types";

import DropIndicator from "./drop-indicator";
import { motion } from "framer-motion";
import DeleteTaskForm from "./action-forms/task/delete-task-form";
import ToggleTaskForm from "./action-forms/task/toggle-task-form";
import { useBoards } from "~/context/boards-context";

const Task = ({
  columnId,
  task,
  handleDragStart,
}: {
  columnId: string;
  task: TaskType;
  handleDragStart: Function;
}) => {
  const { currentBoardId, optimisticBoards } = useBoards();

  if (!currentBoardId)
    return <h1>No currentboardId found (placeholder error)</h1>;

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
        // onDragStart={(e) => handleDragStart(e, task, column.id)}
        draggable
        className="flex shrink-0 cursor-grab items-center justify-between gap-4 rounded-md border border-neutral-700 bg-neutral-800 px-4 py-6 shadow-md"
      >
        {/* <ToggleTaskForm board={board} column={column} task={task} /> */}
        <p
          className={` ${task.completed ? "text-neutral-400 line-through" : ""} w-full`}
        >
          {task.name}
        </p>
        {/* <RenameTaskForm
          board={board}
          column={column}
          task={task}
        /> */}
        <DeleteTaskForm
          boardId={currentBoardId}
          columnId={columnId}
          taskId={task.id}
        />
      </motion.div>
    </>
  );
};

export default Task;
