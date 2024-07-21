/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-types */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBoards } from "~/context/boards-context";
import DropIndicator from "./drop-indicator";
import RenameTaskForm from "./action-forms/task/rename-task-form";
import DeleteTaskForm from "./action-forms/task/delete-task-form";
import ToggleTaskForm from "./action-forms/task/toggle-task-form";
import type { TaskType } from "../types";
import CreateSubtaskForm from "./action-forms/subtask/create-subtask-form";
import DeleteSubtaskForm from "./action-forms/subtask/delete-subtask-form";
import RenameSubtaskForm from "./action-forms/subtask/rename-subtask-form";

const Task = ({
  columnId,
  task,
  handleDragStart,
}: {
  columnId: string;
  task: TaskType;
  handleDragStart: Function;
}) => {
  const { getCurrentBoard } = useBoards();
  const [draggable, setDraggable] = useState(false);

  const currentBoardId = getCurrentBoard()?.id;

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
        <CreateSubtaskForm columnId={columnId} taskId={task.id} />
        <ul>
          {task.subtasks
            .sort((a, b) => a.index - b.index)
            .map((subtask) => (
              <li key={subtask.index}>
                <span className={subtask.completed ? "line-through" : ""}>
                  {subtask.name}
                </span>
                <DeleteSubtaskForm
                  columnId={columnId}
                  taskId={task.id}
                  subtaskId={subtask.id}
                />
                <RenameSubtaskForm
                  columnId={columnId}
                  taskId={task.id}
                  subtaskId={subtask.id}
                />
              </li>
            ))}
        </ul>
      </motion.div>
    </>
  );
};

export default Task;
