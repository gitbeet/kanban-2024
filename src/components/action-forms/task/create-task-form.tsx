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
import useClickOutside from "~/hooks/useClickOutside";

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
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { ref } = useClickOutside<HTMLDivElement>(handleClickOutside);

  const { optimisticBoards } = useBoards();

  function handleClickOutside() {
    setIsOpen(false);
    setTaskName("");
    setError("");
  }

  // Dynamic height for the textarea
  useEffect(() => resizeTextArea(testRef), [taskName, isOpen]);

  const currentColumn = optimisticBoards
    .find((board) => board.id === boardId)
    ?.columns.find((column) => column.id === columnId);

  if (!currentColumn)
    return <h1>Current column not found (placeholder error)</h1>;

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();
    setIsOpen(false);
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
      setIsOpen(true);
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
      setIsOpen(true);
      setError(response.error);
      return;
    }
    setTaskName("");
  };

  const handleCancel = () => {
    setIsOpen(false);
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
      {!isOpen && (
        <motion.div layout>
          <Button onClick={() => setIsOpen(true)} ghost>
            <div className="flex items-center gap-1">
              <FaPlus className="h-3 w-3" />
              <span>Add a task</span>
            </div>
          </Button>
        </motion.div>
      )}
      {isOpen && (
        <div ref={ref}>
          <form
            className="flex flex-col gap-2"
            ref={createTaskRef}
            onSubmit={clientAction}
          >
            <div className="rounded-md bg-neutral-600 p-1.5">
              <textarea
                autoFocus
                ref={testRef}
                rows={1}
                className={` ${error ? "!border-red-500" : ""} input w-full resize-none overflow-hidden !bg-neutral-900`}
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
          </form>
        </div>
      )}
    </>
  );
};

export default CreateTaskForm;
