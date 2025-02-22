"use client";

import React from "react";
import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";
import EditTaskMenus from "./edit-task/edit-task-menus";
import ConfirmDeleteColumn from "./confirm-delete-column";
import EditBoardMenus from "./edit-board/edit-board-menus";

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
      <EditBoardMenus />
      <ConfirmDeleteColumn />
    </>
  );
};

export default Menus;
