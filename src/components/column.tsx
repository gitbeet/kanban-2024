"use client";
import { motion } from "framer-motion";
import { type DragEvent, useRef, useState } from "react";
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
  const [active, setActive] = useState(false);
  const renameColumnRef = useRef<HTMLFormElement>(null);
  const createTaskRef = useRef<HTMLFormElement>(null);

  // Handle dragging the task around
  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    task: TaskType,
    columnId: string,
  ) => {
    e.dataTransfer?.setData("columnId", columnId);
    e.dataTransfer?.setData("taskId", task.id);
    e.dataTransfer?.setData("taskIndex", String(task.index));
  };

  // Handle drag states over column
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    clearHighlights();
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    clearHighlights();
    setActive(false);
  };

  // Indicators handling
  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els ?? getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);
    if (!el.element) return;
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },

      {
        offset: Number.NEGATIVE_INFINITY,

        element: indicators[indicators.length - 1],
      },
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column-id="${column.id}"]`,
      ) as unknown as HTMLElement[],
    );
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragEnd}
      key={column.id}
      className={`h-screen px-4 ${active ? "bg-neutral-700" : ""}`}
    >
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
