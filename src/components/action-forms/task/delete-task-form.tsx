import React, { useState } from "react";
import { deleteTaskAction } from "~/actions";
import { DeleteButton } from "~/components/ui/submit-button";
import type {
  BoardType,
  ColumnType,
  SetOptimisticType,
  TaskType,
} from "~/types";

const DeleteTaskForm = ({
  board,
  column,
  task,
  setOptimistic,
}: {
  board: BoardType;
  column: ColumnType;
  task: TaskType;
  setOptimistic: SetOptimisticType;
}) => {
  const [error, setError] = useState("");

  const clientAction = async () => {
    setOptimistic({
      action: "deleteTask",
      board: board,
      columnId: column.id,
      taskId: task.id,
      taskIndex: task.index.toString(),
    });

    const response = await deleteTaskAction(task.id);
    if (response?.error) {
      setError(response.error);
      console.log(error);
      return;
    }
  };
  return (
    <form action={clientAction}>
      <input type="hidden" name="task-id" value={task.id} />
      <DeleteButton />
    </form>
  );
};

export default DeleteTaskForm;
