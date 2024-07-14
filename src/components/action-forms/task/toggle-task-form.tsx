import React, { useState } from "react";
import { toggleTaskCompletedAction } from "~/actions";
import { ToggleButton } from "~/components/ui/submit-button";
import type {
  BoardType,
  ColumnType,
  SetOptimisticType,
  TaskType,
} from "~/types";
import { TaskSchema } from "~/zod-schemas";

const ToggleTaskForm = ({
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
    // Client validation
    const result = TaskSchema.safeParse(task);
    if (!result.success) {
      return setError(result.error.issues[0]?.message ?? "An error occured");
    }

    setOptimistic({ action: "toggleTask", board, column, task });
    const response = await toggleTaskCompletedAction(task);
    if (response?.error) {
      setError(response.error);
      console.log(error);
      return;
    }
  };
  return (
    <form action={clientAction}>
      <input type="hidden" name="task-id" value={task.id} />
      <input
        readOnly
        type="hidden"
        name="task-completed"
        checked={task.completed ? true : false}
        value={task.completed ? "true" : "false"}
      />
      <ToggleButton checked={task.completed} />
    </form>
  );
};

export default ToggleTaskForm;
