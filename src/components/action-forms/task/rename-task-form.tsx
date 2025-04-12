"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useBoards } from "~/context/boards-context";
import { handleRenameTask } from "~/server/queries";
import { resizeTextArea } from "~/utilities/resizeTextArea";
import { TaskSchema } from "~/zod-schemas";
import type { TaskType } from "~/types";
import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import TextArea from "~/components/ui/text-area";
import FocusTrap from "focus-trap-react";
import { type RenameTaskAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import { motion } from "framer-motion";
import { smallElementTransition } from "~/utilities/framer-motion";
import CancelButton from "~/components/ui/button/cancel-button";
import SaveButton from "~/components/ui/button/save-button";

const RenameTaskForm = ({
  boardId,
  columnId,
  task,
  isRenamingTask,
  setIsRenamingTask,
}: {
  boardId: string;
  columnId: string;
  task: TaskType;
  isRenamingTask: boolean;
  setIsRenamingTask: Dispatch<SetStateAction<boolean>>;
  setDraggale?: Dispatch<SetStateAction<boolean>>;
}) => {
  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newTaskName, setNewTaskName] = useState(task.name);
  const { setOptimisticBoards, getCurrentBoard } = useBoards();
  const [pending, startTransition] = useTransition();

  // Refs
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const renameTaskRef = useRef<HTMLFormElement | null>(null);

  // Dynamic height for the textarea
  useEffect(
    () => resizeTextArea(textAreaRef),
    [task.name, newTaskName, isRenamingTask],
  );

  // Disable draggable when renaming so you can interact with the field
  // useEffect(() => setDraggable?.(!isOpen), [isOpen]);

  const handleTaskNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setNewTaskName(e.target.value);
  };

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    // Client validation
    if (task.name.trim() === newTaskName.trim()) {
      setLoading(false);
      setIsRenamingTask(false);
      setNewTaskName("");
      setError("");
      return;
    }

    const currentBoard = getCurrentBoard();
    const taskAlreadyExists =
      currentBoard?.columns
        .find((col) => col.id === columnId)
        ?.tasks.findIndex(
          (t) =>
            t.name.toLowerCase().trim() === newTaskName.toLowerCase().trim() &&
            t.id !== task.id,
        ) !== -1;
    if (taskAlreadyExists) {
      setError("Already exists");
      setLoading(false);
      textAreaRef.current?.focus();
      return;
    }

    const result = TaskSchema.shape.name.safeParse(newTaskName);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occurred");
      setLoading(false);
      textAreaRef.current?.focus();
      return;
    }

    const action: RenameTaskAction = {
      type: "RENAME_TASK",
      payload: { boardId, columnId, taskId: task.id, newTaskName },
    };

    // client state action
    startTransition(() => {
      setOptimisticBoards(action);
    });

    // Server
    const response = await handleRenameTask({
      action,
    });
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
    }

    // Wait for server to finish then set loading to false
    setLoading(false);
    setIsRenamingTask(false);
    setNewTaskName("");
    setError("");
  };

  function handleClickOutside() {
    setIsRenamingTask(false);
    setNewTaskName(task.name);
    setError("");
  }

  return (
    <div className={`${loading ? "pointer-events-none" : ""} max-w-full`}>
      <FocusTrap
        active={isRenamingTask}
        focusTrapOptions={{
          allowOutsideClick: true,
          escapeDeactivates: true,
          clickOutsideDeactivates: true,
          onDeactivate: handleClickOutside,
        }}
      >
        <form
          className="flex items-center gap-2"
          ref={renameTaskRef}
          onSubmit={clientAction}
        >
          {!isRenamingTask && (
            <button
              aria-label="Click to rename task"
              onClick={() => {
                setNewTaskName(task.name);
                setIsRenamingTask(true);
              }}
              className="input-readonly text-left"
            >
              <p> {task.name}</p>
            </button>
          )}
          {isRenamingTask && (
            <TextArea
              ref={textAreaRef}
              rows={1}
              readOnly={!isRenamingTask}
              className={` ${isRenamingTask ? "input" : "input-readonly"} text-sm dark:bg-neutral-700 dark:focus:bg-neutral-950/50`}
              value={newTaskName}
              onChange={handleTaskNameChange}
              error={error}
            />
          )}
          {isRenamingTask && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={smallElementTransition}
              className={`${error ? "mb-6" : "mb-1"} flex gap-1.5`}
            >
              <SaveButton disabled={!!error || loading || pending} />
              <CancelButton onClick={handleClickOutside} />
            </motion.div>
          )}
        </form>
      </FocusTrap>
    </div>
  );
};

export default RenameTaskForm;
