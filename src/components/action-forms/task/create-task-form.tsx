import { motion } from "framer-motion";
import {
  type ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import type { TaskType } from "~/types";
import { v4 as uuid } from "uuid";
import { createTaskAction } from "~/actions";
import { Button, SubmitButton } from "~/components/ui/buttons";
import { TaskSchema } from "~/zod-schemas";
import { useBoards } from "~/context/boards-context";
import { FaPlus } from "react-icons/fa6";
import { resizeTextArea } from "~/utilities/resizeTextArea";

const CreateTaskForm = ({
  boardId,
  columnId,
}: {
  boardId: string;
  columnId: string;
}) => {
  const testRef = useRef<HTMLTextAreaElement | null>(null);
  const createTaskRef = useRef<HTMLFormElement>(null);
  const { setOptimisticBoards } = useBoards();
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");
  const [active, setActive] = useState(false);
  const [pending, startTransition] = useTransition();

  const { optimisticBoards } = useBoards();

  // Dynamic height for the textarea
  useEffect(() => resizeTextArea(testRef), [taskName, active]);

  const currentColumn = optimisticBoards
    .find((board) => board.id === boardId)
    ?.columns.find((column) => column.id === columnId);

  if (!currentColumn)
    return <h1>Current column not found (placeholder error)</h1>;

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();
    setActive(false);
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
      setActive(true);
      setError(result.error.issues[0]?.message ?? "An error occured");
      return;
    }
    startTransition(() => {
      setOptimisticBoards({
        action: "createTask",
        boardId,
        columnId,
        task: newTask,
      });
    });

    const response = await createTaskAction(newTask);
    if (response?.error) {
      setActive(true);
      setError(response.error);
      return;
    }
    setTaskName("");
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
        <motion.div layout>
          <Button onClick={() => setActive(true)} ghost>
            <div className="flex items-center gap-1">
              <FaPlus className="h-3 w-3" />
              <span>Add a task</span>
            </div>
          </Button>
        </motion.div>
      )}
      {active && (
        <motion.form
          layout
          className="flex flex-col gap-2"
          ref={createTaskRef}
          onSubmit={clientAction}
        >
          <div className="rounded-md bg-neutral-600 p-1.5">
            <textarea
              autoFocus
              ref={testRef}
              rows={1}
              className={` ${error ? "!border-red-500" : ""} input w-full resize-none overflow-hidden`}
              value={taskName}
              onChange={handleChange}
            />
            <p className="text-right text-sm text-red-500"> {error}</p>
          </div>
          <div className="flex items-center gap-2 self-end">
            <Button ghost onClick={handleCancel} type="button">
              Cancel
            </Button>
            <SubmitButton>
              <>Add</>
            </SubmitButton>
          </div>
        </motion.form>
      )}
    </>
  );
};

export default CreateTaskForm;
