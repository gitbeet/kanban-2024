"use client";

import { useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { deleteTaskAction } from "~/actions";
import { FaTrash } from "react-icons/fa";

const DeleteTaskZone = () => {
  const { setOptimisticBoards } = useBoards();
  const [isPending, startTransition] = useTransition();

  const [active, setActive] = useState(false);
  const [error, setError] = useState("");

  const { getCurrentBoard } = useBoards();

  const currentBoardId = getCurrentBoard()?.id;

  if (!currentBoardId)
    return <h1>currentBoardId not found (placeholder error)</h1>;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(false);
  };

  const handleDragEnd = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    // const taskIndex = e.dataTransfer.getData("taskIndex");
    const columnId = e.dataTransfer.getData("columnId");

    // TODO: Client side check needed?
    startTransition(() => {
      setOptimisticBoards({
        action: "deleteTask",
        boardId: currentBoardId,
        columnId,
        taskId,
      });
    });
    setActive(false);

    // TODO: Display error
    const response = await deleteTaskAction(taskId);
    if (response?.error) {
      setError(response.error);
      console.log(error);
      return;
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragEnd}
      className={`grid h-48 w-80 place-content-center rounded-md border border-transparent ${active ? "border-red-500 bg-red-500/50" : "bg-neutral-700"}`}
    >
      <FaTrash
        className={`${active ? "text-red-500" : "text-white"} h-6 w-6`}
      />
    </div>
  );
};

export default DeleteTaskZone;
