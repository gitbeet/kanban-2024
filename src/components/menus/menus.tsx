"use client";

import React from "react";
import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";
import EditTask from "./edit-task/task-window";

const Menus = () => {
  const { editedTask } = useUI();
  const { getCurrentBoard } = useBoards();
  const task = getCurrentBoard()
    ?.columns.find((c) => c.id === editedTask.columnId)
    ?.tasks.find((t) => t.id === editedTask.taskId);

  return (
    <>
      {editedTask.columnId && task && (
        <EditTask columnId={editedTask.columnId} task={task} />
      )}
    </>
  );
};

export default Menus;
