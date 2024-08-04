"use client";

import React from "react";
import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";
import EditTask from "./task";

const Menus = () => {
  const { editedTask } = useUI();
  const { getCurrentBoard } = useBoards();
  const task = getCurrentBoard()
    ?.columns.find((c) => c.id === editedTask.columnId)
    ?.tasks.find((t) => t.id === editedTask.taskId);

  if (!editedTask.columnId || !task) return null;
  return <EditTask columnId={editedTask.columnId} task={task} />;
};

export default Menus;
