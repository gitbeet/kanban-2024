"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import useClickOutside from "~/hooks/useClickOutside";
import { useBoards } from "~/context/boards-context";
import { motion } from "framer-motion";
import { v4 as uuid } from "uuid";
import { resizeTextArea } from "~/utilities/resizeTextArea";
import { createTaskAction } from "~/actions";
import { Button, SubmitButton } from "~/components/ui/buttons";
import { FaPlus } from "react-icons/fa6";
import { TaskSchema } from "~/zod-schemas";
import type { ChangeEvent, FormEvent } from "react";
import type { TaskType } from "~/types";
import TextArea from "~/components/ui/text-area";

const CreateTaskForm = ({
  boardId,
  columnId,
}: {
  boardId: string;
  columnId: string;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { setOptimisticBoards } = useBoards();
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { ref: clickOutsideRef } =
    useClickOutside<HTMLDivElement>(handleClickOutside);

  const { optimisticBoards } = useBoards();

  // Dynamic height for the textarea
  useEffect(() => resizeTextArea(textAreaRef), [taskName, isOpen]);

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

    const newTask: TaskType = {
      id: uuid(),
      index: maxIndex + 1,
      name: taskName,
      columnId,
      completed: false,
      subtasks: [],
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setTaskName(e.target.value);
  };

  function handleClickOutside() {
    setIsOpen(false);
    setTaskName("");
    setError("");
  }

  return (
    <>
      {!isOpen && (
        <motion.div layout>
          <Button variant="text" onClick={() => setIsOpen(true)}>
            <div className="flex items-center gap-1">
              <FaPlus className="h-3 w-3" />
              <span>Add a task</span>
            </div>
          </Button>
        </motion.div>
      )}
      {isOpen && (
        <div ref={clickOutsideRef}>
          <form
            className="flex flex-col gap-2"
            ref={formRef}
            onSubmit={clientAction}
          >
            <div className="rounded-md bg-neutral-600 p-1.5">
              <TextArea
                autoFocus
                ref={textAreaRef}
                className="input"
                rows={1}
                value={taskName}
                onChange={handleChange}
                error={error}
              />
            </div>
            <div className="flex items-center gap-2 self-end">
              <Button
                ghost
                onClick={handleClickOutside}
                type="button"
                variant="ghost"
              >
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
