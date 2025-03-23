"use client";

import { useEffect, useRef, useState } from "react";
import { useBoards } from "~/context/boards-context";
import { motion } from "framer-motion";
import { v4 as uuid } from "uuid";
import { resizeTextArea } from "~/utilities/resizeTextArea";
import { handleCreateTask } from "~/server/queries";
import { Button, SubmitButton } from "~/components/ui/button/buttons";
import { FaPlus } from "react-icons/fa6";
import { TaskSchema } from "~/zod-schemas";
import type { ChangeEvent, FormEvent } from "react";
import type { TaskType } from "~/types";
import TextArea from "~/components/ui/text-area";
import FocusTrap from "focus-trap-react";
import { type CreateTaskAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";

const CreateTaskForm = ({
  boardId,
  columnId,
}: {
  boardId: string;
  columnId: string;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { optimisticBoards, setOptimisticBoards, getCurrentBoard } =
    useBoards();
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentBoard = getCurrentBoard();

  useEffect(() => resizeTextArea(textAreaRef), [taskName, isOpen]);

  const currentColumn = optimisticBoards
    .find((board) => board.id === boardId)
    ?.columns.find((column) => column.id === columnId);

  if (!currentColumn)
    return <h1>Current column not found (placeholder error)</h1>;

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();
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
    // client validation
    if (!currentBoard) {
      setError("Board not found");
      return;
    }
    const taskAlreadyExists =
      currentBoard.columns
        .find((col) => col.id == columnId)
        ?.tasks.findIndex(
          (t) =>
            t.name.toLowerCase().trim() === newTask.name.toLowerCase().trim(),
        ) !== -1;
    if (taskAlreadyExists) {
      setError("Already exists");
      textAreaRef.current?.focus();
      return;
    }

    const result = TaskSchema.safeParse(newTask);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      textAreaRef.current?.focus();
      return;
    }
    // action
    const action: CreateTaskAction = {
      type: "CREATE_TASK",
      payload: { boardId, columnId, task: newTask },
    };
    // client mutation
    setOptimisticBoards(action);
    setTaskName("");
    formRef.current?.scrollIntoView({ block: "end" });
    textAreaRef.current?.focus();
    // server validation / mutation
    setLoading(true);
    const response = await handleCreateTask({
      action,
      revalidate: true,
    });
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
      setLoading(false);
      return;
    }
    setLoading(false);
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
    textAreaRef.current?.blur();
  }

  return (
    <FocusTrap
      active={isOpen}
      focusTrapOptions={{
        escapeDeactivates: true,
        onDeactivate: handleClickOutside,
        allowOutsideClick: true,
        clickOutsideDeactivates: true,
      }}
    >
      <div className="relative z-[1]">
        {!isOpen && (
          <motion.div layout className="pt-2">
            <Button
              variant="text"
              onClick={() => setIsOpen(true)}
              className="!px-0"
              size="small"
            >
              <div className="text-secondary--hoverable flex items-center gap-1">
                <FaPlus className="h-3 w-3" />
                <span>Add a task</span>
              </div>
            </Button>
          </motion.div>
        )}
        {isOpen && (
          <form
            className={`flex flex-col ${error ? "gap-8" : "gap-4"}`}
            ref={formRef}
            onSubmit={clientAction}
          >
            <div className="bg-neutral-600 rounded-md">
              <TextArea
                autoFocus
                ref={textAreaRef}
                className="input"
                rows={1}
                value={taskName}
                onChange={handleChange}
                handleCancel={handleClickOutside}
                handleSubmit={clientAction}
                error={error}
              />
            </div>
            <div className="flex items-center gap-2 self-end">
              <Button
                size="small"
                onClick={handleClickOutside}
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>
              <SubmitButton disabled={loading} size="small">
                Add
              </SubmitButton>
            </div>
          </form>
        )}
      </div>
    </FocusTrap>
  );
};

export default CreateTaskForm;
