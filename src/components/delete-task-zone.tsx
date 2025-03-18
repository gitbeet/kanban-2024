"use client";

import { useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { handleDeleteTask } from "~/server/queries";
import { FaTrash } from "react-icons/fa";
import { useUI } from "~/context/ui-context";

const DeleteTaskZone = () => {
  const { getCurrentBoard } = useBoards();
  const [active, setActive] = useState(false);

  const currentBoardId = getCurrentBoard()?.id;

  const { setShowConfirmDeleteTaskWindow, setEditedTask } = useUI();

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
    const columnId = e.dataTransfer.getData("columnId");

    setEditedTask({ columnId, taskId });
    setShowConfirmDeleteTaskWindow(true);
    setActive(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragEnd}
      className={`grid h-48 w-80 place-content-center rounded-md border drop-shadow-lg ${active ? "border-danger-300 bg-danger-300/60 dark:bg-danger-600/70" : "bg-light__test border-transparent"} relative z-[2]`}
    >
      <FaTrash
        className={`${active ? "text-danger-300" : "text-light"} h-6 w-6`}
      />
    </div>
  );
};

export default DeleteTaskZone;
