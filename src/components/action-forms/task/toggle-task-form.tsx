import { useState } from "react";
import { useBoards } from "~/context/boards-context";
import { toggleTaskCompletedAction } from "~/actions";
import { ToggleButton } from "~/components/ui/buttons";
import type { TaskType } from "~/types";

const ToggleTaskForm = ({
  boardId,
  columnId,
  task,
}: {
  boardId: string;
  columnId: string;
  task: TaskType;
}) => {
  const [error, setError] = useState("");
  const { setOptimisticBoards } = useBoards();
  const clientAction = async () => {
    setOptimisticBoards({
      action: "toggleTask",
      boardId,
      columnId,
      taskId: task.id,
    });
    const response = await toggleTaskCompletedAction(task.id);
    if (response?.error) {
      setError(response.error);
      console.log(error);
      return;
    }
  };
  return (
    <form action={clientAction}>
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
