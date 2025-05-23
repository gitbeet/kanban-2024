"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useBoards } from "~/context/boards-context";
import { motion } from "framer-motion";
import { v4 as uuid } from "uuid";
import { resizeTextArea } from "~/utilities/resizeTextArea";
import { TaskSchema } from "~/utilities/zod-schemas";
import type { ChangeEvent, FormEvent } from "react";
import type { TaskType } from "~/types";
import TextArea from "~/components/ui/input/text-area";
import FocusTrap from "focus-trap-react";
import { type CreateTaskAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import {
  modalTransition,
  slideButtonsRightVariants,
  slideFormDownVariants,
  smallElementTransition,
} from "~/utilities/framer-motion";
import { Button } from "~/components/ui/button/button";
import AddButton from "~/components/ui/button/add-button";
import SubmitButton from "~/components/ui/button/submit-button";
import { handleCreateTask } from "~/server/server-actions/task/create-task";

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
    startTransition(() => {
      setOptimisticBoards(action);
    });
    setTaskName("");
    formRef.current?.scrollIntoView({ block: "end" });
    textAreaRef.current?.focus();
    // server validation / mutation
    setLoading(true);
    const response = await handleCreateTask({
      action,
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
      <div className="relative z-[1] pt-2">
        {!isOpen && (
          <motion.div layout transition={smallElementTransition}>
            <AddButton text="Add a task" onClick={() => setIsOpen(true)} />
          </motion.div>
        )}
        {isOpen && (
          <motion.form
            layout
            variants={slideFormDownVariants}
            initial="initial"
            animate="animate"
            transition={smallElementTransition}
            className={`flex flex-col gap-2`}
            ref={formRef}
            onSubmit={clientAction}
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={modalTransition}
            >
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
            </motion.div>
            <motion.div
              variants={slideButtonsRightVariants}
              initial="initial"
              animate="animate"
              transition={{ ...smallElementTransition, delay: 0.1 }}
              className="flex items-center gap-1.5 self-end"
            >
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
            </motion.div>
          </motion.form>
        )}
      </div>
    </FocusTrap>
  );
};

export default CreateTaskForm;
