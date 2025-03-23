"use client";

import { EditTaskAdvanced } from "./edit-task-advanced";
import ConfirmDeleteTaskWindow from "./confirm-delete-task-window";
import EditTask from "./edit-task";
import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";

const placeholderTask = {
  id: "1",
  name: "Placeholder",
  columnId: "1",
  index: 1,
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  subtasks: [],
};

const EditTaskMenus = () => {
  const { editedTask } = useUI();
  const { getCurrentBoard } = useBoards();
  const task =
    getCurrentBoard()
      ?.columns.find((c) => c.id === editedTask.columnId)
      ?.tasks.find((t) => t.id === editedTask.taskId) ?? placeholderTask;

  return (
    <>
      <EditTask task={task} columnId={task.columnId} />
      <EditTaskAdvanced task={task} columnId={task.columnId} />
      <ConfirmDeleteTaskWindow task={task} columnId={task.columnId} />
    </>
  );
};

export default EditTaskMenus;
