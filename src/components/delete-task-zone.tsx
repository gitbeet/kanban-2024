"use client";
import { useRef, useState } from "react";
import { deleteTaskAction } from "~/actions";
import type { BoardType, SetOptimisticType } from "~/types";

const DeleteTaskZone = ({
  setOptimistic,
  board,
}: {
  setOptimistic: SetOptimisticType;
  board: BoardType;
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(false);
  };

  const formRef = useRef<HTMLFormElement | null>(null);
  const taskIdinputRef = useRef<HTMLInputElement | null>(null);

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const taskIndex = e.dataTransfer.getData("taskIndex");
    const columnId = e.dataTransfer.getData("columnId");
    if (!taskId) alert("No task id");
    if (!taskIdinputRef.current) return;
    taskIdinputRef.current.value = taskId;
    setActive(false);
    setOptimistic({ action: "deleteTask", board, columnId, taskId, taskIndex });
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${active ? "bg-red-500" : ""}`}
      >
        Delete task
      </div>
      <form
        className="hidden"
        ref={formRef}
        action={async (formData) => {
          await deleteTaskAction(formData);
        }}
      >
        <input ref={taskIdinputRef} type="hidden" name="task-id" />
      </form>
    </>
  );
};

export default DeleteTaskZone;
