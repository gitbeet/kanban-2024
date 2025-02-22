"use client";

import React from "react";
import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";
import EditTaskMenus from "./edit-task/task-menus";
import ConfirmDeleteColumn from "./confirm-delete-column";

const Menus = () => {
  const { editedTask } = useUI();
  const { getCurrentBoard } = useBoards();
  const task = getCurrentBoard()
    ?.columns.find((c) => c.id === editedTask.columnId)
    ?.tasks.find((t) => t.id === editedTask.taskId);

  return (
    <>
      {editedTask.columnId && task && (
        <EditTaskMenus columnId={editedTask.columnId} task={task} />
      )}
      <ConfirmDeleteColumn />
    </>
  );
};

export default Menus;
