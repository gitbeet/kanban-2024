"use client";
import { useState, useTransition } from "react";
import { FaTrash } from "react-icons/fa";
import { deleteTaskAction } from "~/actions";
import type { BoardType, SetOptimisticType } from "~/types";
import { motion } from "framer-motion";

const DeleteTaskZone = ({
  setOptimistic,
  board,
}: {
  setOptimistic: SetOptimisticType;
  board: BoardType;
}) => {
  const [isPending, startTransition] = useTransition();

  const [active, setActive] = useState(false);
  const [error, setError] = useState("");

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
    const taskIndex = e.dataTransfer.getData("taskIndex");
    const columnId = e.dataTransfer.getData("columnId");

    // TODO: Client side check needed?
    startTransition(() => {
      setOptimistic({
        action: "deleteTask",
        board: board,
        columnId: columnId,
        taskId,
        oldColumnIndex: Number(taskIndex),
      });
    });

    // TODO: Display error
    const response = await deleteTaskAction(taskId);
    if (response?.error) {
      setError(response.error);
      console.log(error);
      return;
    }
    setActive(false);
  };

  return (
    <motion.div
      layout
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragEnd}
      className={`grid h-48 w-80 shrink-0 place-content-center rounded border text-3xl ${active ? "border-red-500 bg-red-500/10" : ""}`}
    >
      <FaTrash className={`${active ? "text-red-500" : "text-white"}`} />
    </motion.div>
  );
};

export default DeleteTaskZone;
