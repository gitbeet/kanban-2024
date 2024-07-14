"use client";
import { type DragEvent, useRef, useState, useTransition } from "react";
import type {
  TaskType,
  ColumnType,
  BoardType,
  SetOptimisticType,
} from "../types";
import Task from "../components/task";
import { switchColumnAction } from "~/actions";
import DropIndicator from "./drop-indicator";

import RenameColumnForm from "./action-forms/column/rename-column-form";
import DeleteColumnForm from "./action-forms/column/delete-column-form";
import CreateTaskForm from "./action-forms/task/create-task-form";
import { SwitchTaskActionSchema } from "~/zod-schemas";
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
  // TODO : Disable dragging when pending ?
  const [isPending, startTransition] = useTransition();

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

  const handleDragEnd = async (e: DragEvent) => {
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

    if (!beforeColumnId) return;
    startTransition(async () => {
      await clientAction(
        taskId,
        columnId,
        beforeColumnId,
        beforeIndex,
        taskIndex,
      );
    });
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

  async function clientAction(
    taskId: string,
    oldColumnId: string,
    newColumnId: string,
    oldColumnIndex: string,
    newColumnIndex: string,
  ) {
    const result = SwitchTaskActionSchema.safeParse({
      taskId,
      oldColumnId,
      newColumnId,
      oldColumnIndex: Number(oldColumnIndex),
      newColumnIndex: Number(newColumnIndex),
    });
    // TODO: Display the error
    if (!result.success) {
      console.log(result.error.issues[0]?.message);
      return;
    }

    setOptimistic({
      action: "switchTaskColumn",
      board,
      column,
      taskId,
      oldColumnId,
      newColumnId,
      oldColumnIndex: Number(oldColumnIndex),
      newColumnIndex: Number(newColumnIndex),
    });

    const response = await switchColumnAction(
      taskId,
      oldColumnId,
      newColumnId,
      oldColumnIndex,
      newColumnIndex,
    );
    // TODO: Display the error
    if (response?.error) {
      console.log(response.error);
      return;
    }
  }

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        key={column.id}
        className={`h-screen px-4 ${active ? "bg-neutral-700" : ""}`}
      >
        <div className="flex items-center gap-4 pb-12">
          <h3 className="text-lg font-bold">Column name: {column.name}</h3>
          <DeleteColumnForm
            board={board}
            column={column}
            setOptimistic={setOptimistic}
          />
          <RenameColumnForm
            board={board}
            column={column}
            setOptimistic={setOptimistic}
          />
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
        <CreateTaskForm
          board={board}
          column={column}
          setOptimistic={setOptimistic}
        />
      </div>
    </>
  );
};

export default Column;
