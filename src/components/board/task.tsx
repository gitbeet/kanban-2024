/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-types */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBoards } from "~/context/boards-context";
import DropIndicator from "./drop-indicator";
import RenameTaskForm from "../action-forms/task/rename-task-form";
import { useUI } from "~/context/ui-context";
import { EditButton } from "../ui/button/buttons";
import type { TaskType } from "../../types";
import CreateSubtaskForm from "../action-forms/subtask/create-subtask-form";

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
  const { setShowEditTaskMenu, setEditedTask } = useUI();

  const currentBoardId = getCurrentBoard()?.id;

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const allSubtasks = task.subtasks.length;

  const handleClick = () => {
    setShowEditTaskMenu(true);
    setEditedTask({ columnId, taskId: task.id });
  };

  // "draggable" is set to false when renaming so the state can be used to hide the menu button while renaming the task
  const menuButtonJsx = draggable && (
    <EditButton
      className="bg-dark text-light absolute right-1 top-1 z-[2] flex !h-5 !w-5 items-center justify-center p-0.5 focus-visible:opacity-100"
      onClick={handleClick}
    />
  );

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
        layout="position"
        layoutId={task.id}
        onDragStart={(e) => handleDragStart(e, task, columnId)}
        draggable={draggable}
        className="task-bg group relative flex shrink-0 cursor-grab flex-col gap-1 rounded-lg p-1.5"
      >
        <RenameTaskForm
          setDraggable={setDraggable}
          boardId={currentBoardId}
          columnId={columnId}
          task={task}
        />

        {menuButtonJsx}
        {allSubtasks > 0 && (
          <div className="pl-2 text-xs text-neutral-500">
            {completedSubtasks} of {allSubtasks} subtasks
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Task;
