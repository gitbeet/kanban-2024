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
import SubmitButton, { DeleteButton, EditButton } from "./ui/submit-button";
import { v4 as uuid } from "uuid";
import {
  createTaskAction,
  deleteColumnAction,
  renameColumnAction,
  switchColumnAction,
} from "~/actions";
import DropIndicator from "./drop-indicator";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
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
  const [taskName, setTaskName] = useState("");
  // Refs
  const renameColumnRef = useRef<HTMLFormElement>(null);
  const createTaskRef = useRef<HTMLFormElement>(null);

  const switchColumnRef = useRef<HTMLFormElement>(null);

  const taskIdRef = useRef<HTMLInputElement | null>(null);
  const oldColumnIdRef = useRef<HTMLInputElement | null>(null);
  const newColumnIdRef = useRef<HTMLInputElement | null>(null);
  const oldColumnIndexRef = useRef<HTMLInputElement | null>(null);
  const newColumnIndexRef = useRef<HTMLInputElement | null>(null);

  // Handle dragging the task around
  const handleDragStart = (e: DragEvent, task: TaskType, columnId: string) => {
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

  const handleDragEnd = (e: DragEvent) => {
    // id of the task we are dragging
    const taskId = e.dataTransfer.getData("taskId");
    // columnId of the task we are dragging, aka the original column we are coming from
    const columnId = e.dataTransfer.getData("columnId");
    // index of the task we are dragging, aka the original index the task had before we started dragging
    const taskIndex = e.dataTransfer.getData("taskIndex");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    // id of the task we are hovering over (from the drop indicator)
    const before = element?.dataset?.beforeId ?? "-1";
    // index of the task we are hovering over (from the drop indicator)
    const beforeIndex = element?.dataset?.beforeIndex;
    const beforeColumnId = element?.dataset?.columnId;
    if (beforeIndex === undefined) return;
    // If we are trying to put the task in the same place just return
    if (before === taskId) return;

    if (
      !taskIdRef.current ||
      !oldColumnIdRef.current ||
      !newColumnIdRef.current ||
      !oldColumnIndexRef.current ||
      !newColumnIndexRef.current ||
      !beforeColumnId
    )
      return;
    console.log("Hello");

    taskIdRef.current.value = taskId;
    oldColumnIdRef.current.value = columnId;
    newColumnIdRef.current.value = beforeColumnId;
    oldColumnIndexRef.current.value = taskIndex;
    newColumnIndexRef.current.value = beforeIndex;

    switchColumnRef.current?.requestSubmit();
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

  // Action forms jsx

  const switchColumnActionForm = (
    <form
      ref={switchColumnRef}
      className="hidden"
      action={async (formData: FormData) => {
        const taskId = formData.get("task-id") as string;
        const oldColumnId = formData.get("old-column-id") as string;
        const newColumnId = formData.get("new-column-id") as string;
        const taskIndex = formData.get("old-column-index") as string;
        const newColumnIndex = parseInt(
          formData.get("new-column-index") as string,
        );

        setOptimistic({
          action: "switchTaskColumn",
          board,
          column,
          taskId,
          oldColumnId,
          newColumnId,
          newColumnIndex,
          taskIndex,
        });

        await switchColumnAction(formData);
      }}
    >
      <input ref={taskIdRef} type="hidden" name="task-id" />
      <input ref={oldColumnIdRef} type="hidden" name="old-column-id" />
      <input ref={newColumnIdRef} type="hidden" name="new-column-id" />
      <input ref={oldColumnIndexRef} type="hidden" name="old-column-index" />
      <input ref={newColumnIndexRef} type="hidden" name="new-column-index" />
    </form>
  );

  const deleteColumnActionForm = (
    <form
      action={async (formData: FormData) => {
        setOptimistic({ action: "deleteColumn", board, column });
        await deleteColumnAction(formData);
      }}
    >
      <input type="hidden" name="column-id" value={column.id} />
      <DeleteButton />
    </form>
  );

  const renameColumnActionForm = (
    <form
      className="flex"
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
      <SubmitButton icon={<FaEdit />} />
    </form>
  );

  const createTaskActionForm = (
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
        setOptimistic({
          action: "createTask",
          board,
          column,
          task: newTask,
        });
        await createTaskAction(formData);
      }}
    >
      <input type="hidden" name="column-id" value={column.id} />
      <input
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        type="text"
        name="task-name-input"
        placeholder="New name for task..."
      />
      <EditButton />
    </motion.form>
  );

  return (
    <>
      {switchColumnActionForm}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        key={column.id}
        className={`h-screen px-4 ${active ? "bg-neutral-700" : ""}`}
      >
        <div className="flex items-center gap-4 pb-12">
          <h3 className="text-lg font-bold">Column name: {column.name}</h3>
          {deleteColumnActionForm}
          {renameColumnActionForm}
        </div>

        <div>
          <h4 className="font-bold">Tasks</h4>
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
          <DropIndicator
            beforeId="-1"
            columnId={column.id}
            beforeIndex={(column.tasks.length + 1).toString()}
          />
        </div>

        {createTaskActionForm}
      </div>
    </>
  );
};

export default Column;
