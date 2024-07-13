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
import SubmitButton from "./ui/submit-button";
import {
  deleteTaskAction,
  renameTaskAction,
  switchColumnAction,
  toggleTaskCompletedAction,
} from "~/actions";
import DropIndicator from "./drop-indicator";
import { motion } from "framer-motion";

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
      <SubmitButton text="Rename" />
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
      <SubmitButton text="Delete" />
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
        type="hidden"
        name="task-completed"
        value={task.completed ? "true" : "false"}
      />
      <SubmitButton text="Toggle" />
    </form>
  );

  const switchColumnActionForm = (
    <form
      action={async (formData: FormData) => {
        const newColumnId = formData.get("new-column-id") as string;
        const oldColumnId = formData.get("old-column-id") as string;

        const newColumnIndex = parseInt(
          formData.get("new-column-index") as string,
        );
        setOptimistic({
          action: "switchTaskColumn",
          board,
          column,
          task,
          newColumnId,
          newColumnIndex,
          oldColumnId,
        });

        await switchColumnAction(formData);
      }}
    >
      <input type="hidden" name="task-id" value={task.id} />
      <input type="hidden" name="old-column-index" value={task.index} />
      <input type="hidden" name="new-column-index" value={4} />
      <input
        type="hidden"
        name="old-column-id"
        value="cff16e14-4155-460e-ba5b-f54115228110"
      />
      <input
        type="hidden"
        name="new-column-id"
        value="cff16e14-4155-460e-ba5b-f54115228110"
      />
      <SubmitButton text="Move" />
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
        <p className="pr-2">{task.completed ? "(v)" : "(x)"}</p>
        <p className="w-32 text-xl">{task.name}</p>
        {renameTaskActionForm}
        {deleteTaskActionForm}
        {toggleTaskActionForm}
        {switchColumnActionForm}
      </motion.div>
    </>
  );
};

export default Task;
