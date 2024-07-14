import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type {
  BoardType,
  ColumnType,
  SetOptimisticType,
  TaskType,
} from "~/types";
import { v4 as uuid } from "uuid";
import { createTaskAction } from "~/actions";
import { CreateButton, EditButton } from "~/components/ui/submit-button";
import { TaskSchema } from "~/zod-schemas";
import InputField from "~/components/ui/input-field";

const CreateTaskForm = ({
  board,
  column,
  setOptimistic,
}: {
  board: BoardType;
  column: ColumnType;
  setOptimistic: SetOptimisticType;
}) => {
  const createTaskRef = useRef<HTMLFormElement>(null);
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");

  const clientAction = async () => {
    const maxIndex =
      column.tasks.length < 1
        ? 0
        : Math.max(...column.tasks.map((t) => t.index));

    createTaskRef.current?.reset();
    const newTask: TaskType = {
      id: uuid(),
      index: maxIndex + 1,
      name: taskName,
      columnId: column.id,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = TaskSchema.safeParse(newTask);
    if (!result.success) {
      return setError(result.error.issues[0]?.message ?? "An error occured");
    }

    setOptimistic({
      action: "createTask",
      board,
      column,
      task: newTask,
    });

    const response = await createTaskAction(newTask);
    if (response?.error) {
      return setError(response.error);
    }
  };

  return (
    <motion.form
      layout
      className="flex space-x-2 pt-8"
      ref={createTaskRef}
      action={clientAction}
    >
      <input type="hidden" name="column-id" value={column.id} />
      <InputField
        type="text"
        name="task-name-input"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        error={error}
        placeholder="New task..."
      />

      <CreateButton />
    </motion.form>
  );
};

export default CreateTaskForm;
