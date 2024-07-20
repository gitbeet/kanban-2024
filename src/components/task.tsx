/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-types */
"use client";

import type { TaskType } from "../types";

import DropIndicator from "./drop-indicator";
import { motion } from "framer-motion";
import DeleteTaskForm from "./action-forms/task/delete-task-form";
import ToggleTaskForm from "./action-forms/task/toggle-task-form";
import { useBoards } from "~/context/boards-context";
import RenameTaskForm from "./action-forms/task/rename-task-form";
import { useState } from "react";

const Task = ({
  columnId,
  task,
  handleDragStart,
}: {
  columnId: string;
  task: TaskType;
  handleDragStart: Function;
}) => {
  const { currentBoardId } = useBoards();
  const [draggable, setDraggable] = useState(false);

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
        onDragStart={(e) => handleDragStart(e, task, columnId)}
        draggable={draggable}
        className="group relative flex shrink-0 cursor-grab items-center justify-between gap-4 rounded-lg border-2 border-neutral-700 border-transparent bg-neutral-700 p-1.5 shadow-md hover:border-sky-300"
      >
        {/* <ToggleTaskForm
          boardId={currentBoardId}
          columnId={columnId}
          task={task}
        /> */}
        <RenameTaskForm
          setDraggable={setDraggable}
          boardId={currentBoardId}
          columnId={columnId}
          task={task}
        />
        <div className="pointer-events-none z-10 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100">
          <DeleteTaskForm
            boardId={currentBoardId}
            columnId={columnId}
            taskId={task.id}
          />
        </div>
      </motion.div>
    </>
  );
};

export default Task;
