"use client";

import type { TaskType } from "~/types";
import { EditTaskMenu } from "./edit-task-menu";
import ConfirmDeleteTaskWindow from "./confirm-delete-task-window";
import EditTaskWindow from "./edit-task-window";

const EditTaskMenus = ({
  columnId,
  task,
}: {
  columnId: string;
  task: TaskType;
}) => {
  return (
    <>
      <EditTaskWindow task={task} columnId={columnId} />
      <EditTaskMenu task={task} columnId={columnId} />
      <ConfirmDeleteTaskWindow task={task} columnId={columnId} />
    </>
  );
};

export default EditTaskMenus;
