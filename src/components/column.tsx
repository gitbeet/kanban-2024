"use client";

import { useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import RenameColumnForm from "./action-forms/column/rename-column-form";
import DeleteColumnForm from "./action-forms/column/delete-column-form";
import CreateTaskForm from "./action-forms/task/create-task-form";
import Task from "../components/task";
import DropIndicator from "./drop-indicator";
import { SwitchTaskActionSchema } from "~/zod-schemas";
import type { DragEvent } from "react";
import type { TaskType, ColumnType } from "../types";
import { handleSwitchTaskColumn } from "~/server/queries";

const Column = ({
  boardId,
  column,
}: {
  boardId: string;
  column: ColumnType;
}) => {
  const [active, setActive] = useState(false);
  // TODO : Disable dragging when pending ?
  const [isPending, startTransition] = useTransition();
  const { setOptimisticBoards } = useBoards();
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
    // fix useTransition only on optimistic
    await clientAction(
      taskId,
      columnId,
      beforeColumnId,
      taskIndex,
      beforeIndex,
    );
  };

  // Indicators handling
  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els ?? getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
      // i.style.height = "0.375rem";
      // i.style.marginBlock = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);
    if (!el.element) return;
    el.element.style.opacity = "1";
    // el.element.style.height = "4rem";
    // el.element.style.marginBlock = "0.5rem";
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
    startTransition(() => {
      setOptimisticBoards({
        action: "switchTaskColumn",
        boardId,
        taskId,
        oldColumnId,
        newColumnId,
        oldColumnIndex: Number(oldColumnIndex),
        newColumnIndex: Number(newColumnIndex),
      });
    });

    const response = await handleSwitchTaskColumn({
      change: {
        action: "switchTaskColumn",
        taskId,
        oldColumnId,
        newColumnId,
        oldColumnIndex: Number(oldColumnIndex),
        newColumnIndex: Number(newColumnIndex),
      },
      revalidate: true,
    });
    // TODO: Display the error
    if (response?.error) {
      console.log(response.error);
      return;
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragEnd}
      key={column.id}
      // hard coded width for transition animation
      className={`${active ? "bg-neutral-950/20" : ""} min-h-screen w-80 shrink-0 rounded-md px-3`}
    >
      <div className="flex items-center justify-between gap-4 p-4">
        <h3 className="flex items-center gap-2 font-bold text-neutral-250">
          {/* hard coded width to avoid shifting of column name */}
          <span className="shrink-0 text-neutral-500">
            ({column.tasks.length})
          </span>
          <RenameColumnForm boardId={boardId} columnId={column.id} />
        </h3>
        <DeleteColumnForm boardId={boardId} columnId={column.id} />
      </div>
      {column.tasks
        .sort((a, b) => a.index - b.index)
        .map((task) => (
          <Task
            key={task.id}
            columnId={column.id}
            task={task}
            handleDragStart={handleDragStart}
          />
        ))}
      <DropIndicator
        beforeId="-1"
        columnId={column.id}
        beforeIndex={(column.tasks.length + 1).toString()}
      />

      <CreateTaskForm boardId={boardId} columnId={column.id} />
    </div>
  );
};

export default Column;
