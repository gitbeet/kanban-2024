import { motion } from "framer-motion";
import { type ChangeEvent, useRef, useState } from "react";
import type {
  BoardType,
  ColumnType,
  SetOptimisticType,
  TaskType,
} from "~/types";
import { v4 as uuid } from "uuid";
import { createTaskAction } from "~/actions";
import SubmitButton from "~/components/ui/submit-button";
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
  const [active, setActive] = useState(false);

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
    setActive(false);
    setTaskName("");
    const response = await createTaskAction(newTask);
    if (response?.error) {
      return setError(response.error);
    }
  };

  const handleCancel = () => {
    setActive(false);
    setError("");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setTaskName(e.target.value);
  };

  return (
    <>
      {!active && (
        <motion.button
          layout
          onClick={() => setActive(true)}
          className="font-medium text-white"
        >
          Add +
        </motion.button>
      )}
      {active && (
        <form
          className="flex flex-col gap-2"
          ref={createTaskRef}
          action={clientAction}
        >
          <InputField
            textarea
            type="text"
            name="task-name-input"
            value={taskName}
            onChange={handleChange}
            error={error}
            placeholder="New task..."
          />
          <div className="flex items-center gap-2 self-end">
            <button onClick={handleCancel} type="button">
              Cancel
            </button>
            <SubmitButton text="Add" />
          </div>
        </form>
      )}
    </>
  );
};

export default CreateTaskForm;
