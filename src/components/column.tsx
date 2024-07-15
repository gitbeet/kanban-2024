"use client";
import { type DragEvent, useState, useTransition } from "react";
import type { TaskType, ColumnType, BoardType } from "../types";
import Task from "../components/task";
import { switchColumnAction } from "~/actions";
import DropIndicator from "./drop-indicator";

import RenameColumnForm from "./action-forms/column/rename-column-form";
import DeleteColumnForm from "./action-forms/column/delete-column-form";
import CreateTaskForm from "./action-forms/task/create-task-form";
import { SwitchTaskActionSchema } from "~/zod-schemas";
import { useBoards } from "~/context/boards-context";
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

    // setOptimisticBoards({
    //   action: "switchTaskColumn",
    //   board,
    //   column,
    //   taskId,
    //   oldColumnId,
    //   newColumnId,
    //   oldColumnIndex: Number(oldColumnIndex),
    //   newColumnIndex: Number(newColumnIndex),
    // });

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
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragEnd}
      key={column.id}
      className={`${active ? "bg-neutral-800" : ""} min-h-screen w-80 shrink-0 rounded-md px-2 pt-4`}
    >
      <div className="flex items-center gap-4 pb-12">
        <h3 className="text-lg">
          <span className="font-semibold">{column.name} </span>
          <span className="font-normal text-neutral-400">
            ({column.tasks.length})
          </span>
        </h3>
        <DeleteColumnForm boardId={boardId} columnId={column.id} />
        <RenameColumnForm boardId={boardId} columnId={column.id} />
      </div>
      <div>
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
        <div className="h-4"></div>
      </div>

      <CreateTaskForm boardId={boardId} columnId={column.id} />
    </div>
  );
};

export default Column;
