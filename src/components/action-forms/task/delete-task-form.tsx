import React, { useState } from "react";
import { deleteTaskAction } from "~/actions";
import { DeleteButton } from "~/components/ui/submit-button";
import { useBoards } from "~/context/boards-context";
import type { BoardType, ColumnType, TaskType } from "~/types";

const DeleteTaskForm = ({
  board,
  column,
  task,
}: {
  board: BoardType;
  column: ColumnType;
  task: TaskType;
}) => {
  const [error, setError] = useState("");
  const { setOptimisticBoards } = useBoards();

  const clientAction = async () => {
    setOptimisticBoards({
      action: "deleteTask",
      board: board,
      columnId: column.id,
      taskId: task.id,
      oldColumnIndex: task.index,
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
