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
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    task: TaskType,
    columnId: string,
  ) => void;
}) => {
  const renameTaskRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <DropIndicator beforeId={task.id} columnId={task.columnId} />
      <div
        onDragStart={(e) => handleDragStart(e, task, column.id)}
        draggable
        className="flex cursor-grab items-center gap-4 border p-4"
      >
        <p className="pr-2">{task.completed ? "(v)" : "(x)"}</p>
        <p className="w-32 text-xl">{task.name}</p>
        <p>Index - {task.index}</p>
        {/* RENAME TASK ACTION */}
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
        {/* DELETE TASK ACTION */}
        <form
          action={async (formData) => {
            setOptimistic({
              action: "deleteTask",
              board,
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
        {/* TOGGLE TASK */}
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
        {/* SWITCH COLUMN TEST */}
        {/* <form
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
          <input type="hidden" name="new-column-index" value={2} />
          <input
            type="hidden"
            name="old-column-id"
            value="1905060a-4484-4592-b4eb-3da48f9414a4"
          />
          <input
            type="hidden"
            name="new-column-id"
            value="cff16e14-4155-460e-ba5b-f54115228110"
          />
          <SubmitButton text=" -> 11" />
        </form>
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
          <input type="hidden" name="new-column-index" value={2} />
          <input
            type="hidden"
            name="old-column-id"
            value="cff16e14-4155-460e-ba5b-f54115228110"
          />
          <input
            type="hidden"
            name="new-column-id"
            value="1905060a-4484-4592-b4eb-3da48f9414a4"
          />
          <SubmitButton text="<- 1" />
        </form> */}
      </div>
    </>
  );
};

export default Task;
