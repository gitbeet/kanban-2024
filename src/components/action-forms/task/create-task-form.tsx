import { motion } from "framer-motion";
import { type ChangeEvent, useRef, useState } from "react";
import type { BoardType, ColumnType, TaskType } from "~/types";
import { v4 as uuid } from "uuid";
import { createTaskAction } from "~/actions";
import SubmitButton from "~/components/ui/submit-button";
import { TaskSchema } from "~/zod-schemas";
import InputField from "~/components/ui/input-field";
import { useBoards } from "~/context/boards-context";
import { FaPlus } from "react-icons/fa6";

const CreateTaskForm = ({
  boardId,
  columnId,
}: {
  boardId: string;
  columnId: string;
}) => {
  const createTaskRef = useRef<HTMLFormElement>(null);
  const { setOptimisticBoards } = useBoards();
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");
  const [active, setActive] = useState(false);

  const { optimisticBoards } = useBoards();

  const currentColumn = optimisticBoards
    .find((board) => board.id === boardId)
    ?.columns.find((column) => column.id === columnId);

  if (!currentColumn)
    return <h1>Current column not found (placeholder error)</h1>;

  const clientAction = async () => {
    const maxIndex =
      currentColumn.tasks.length < 1
        ? 0
        : Math.max(...currentColumn.tasks.map((t) => t.index));

    createTaskRef.current?.reset();
    const newTask: TaskType = {
      id: uuid(),
      index: maxIndex + 1,
      name: taskName,
      columnId,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = TaskSchema.safeParse(newTask);
    if (!result.success) {
      return setError(result.error.issues[0]?.message ?? "An error occured");
    }

    setOptimisticBoards({
      action: "createTask",
      boardId,
      columnId,
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
          className="flex items-center gap-2 font-medium text-white"
        >
          <FaPlus />
          <span>Add a card</span>
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
