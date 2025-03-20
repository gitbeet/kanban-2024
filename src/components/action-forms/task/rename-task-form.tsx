"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useBoards } from "~/context/boards-context";
import { handleRenameTask } from "~/server/queries";
import { resizeTextArea } from "~/utilities/resizeTextArea";
import { CancelButton, SaveButton } from "~/components/ui/button/buttons";
import { TaskSchema } from "~/zod-schemas";
import type { TaskType } from "~/types";
import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import TextArea from "~/components/ui/text-area";
import FocusTrap from "focus-trap-react";

const RenameTaskForm = ({
  boardId,
  columnId,
  task,
  setDraggable,
}: {
  boardId: string;
  columnId: string;
  task: TaskType;
  setDraggable?: Dispatch<SetStateAction<boolean>>;
}) => {
  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newTaskName, setNewTaskName] = useState(task.name);
  const [isOpen, setIsOpen] = useState(false);
  const { setOptimisticBoards } = useBoards();
  const [pending, startTransition] = useTransition();

  // Refs
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const renameTaskRef = useRef<HTMLFormElement | null>(null);

  // Dynamic height for the textarea
  useEffect(
    () => resizeTextArea(textAreaRef),
    [task.name, newTaskName, isOpen],
  );

  // Disable draggable when renaming so you can interact with the field
  useEffect(() => setDraggable?.(!isOpen), [isOpen, setDraggable]);

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
    const result = TaskSchema.shape.name.safeParse(newTaskName);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occurred");
      setLoading(false);
      textAreaRef.current?.focus();
      return;
    }
    // client state change
    startTransition(() => {
      setOptimisticBoards({
        action: "renameTask",
        payload: { boardId, columnId, taskId: task.id, newTaskName },
      });
    });

    // Server
    const response = await handleRenameTask({
      change: {
        action: "renameTask",
        payload: { boardId, newTaskName, columnId, taskId: task.id },
      },
      revalidate: true,
    });
    if (response?.error) {
      setError(response.error);
      setLoading(false);
      // If server action fails open again
      setIsOpen(true);
      console.log("In server error");
      textAreaRef.current?.focus();
      return;
    }

    // Wait for server to finish then set loading to false
    setLoading(false);
    setIsOpen(false);
    setNewTaskName("kekw");
    setError("");
  };

  function handleClickOutside() {
    setIsOpen(false);
    setNewTaskName(task.name);
    setError("");
  }

  return (
    <div className={`${loading ? "pointer-events-none" : ""} `}>
      <FocusTrap
        active={isOpen}
        focusTrapOptions={{
          allowOutsideClick: true,
          escapeDeactivates: true,
          clickOutsideDeactivates: true,
          onDeactivate: handleClickOutside,
        }}
      >
        <form
          className="flex flex-col gap-2"
          ref={renameTaskRef}
          onSubmit={clientAction}
        >
          <div className="relative">
            {!isOpen && (
              <button
                aria-label="Click to rename task"
                onClick={() => {
                  setNewTaskName(task.name);
                  setIsOpen(true);
                }}
                className="input-readonly w-full text-left"
              >
                <p> {task.name}</p>
              </button>
            )}
            {isOpen && (
              <TextArea
                ref={textAreaRef}
                rows={1}
                readOnly={!isOpen}
                className={` ${isOpen ? "input" : "input-readonly"} text-sm dark:bg-neutral-700 dark:focus:bg-neutral-950/50`}
                value={newTaskName}
                onChange={handleTaskNameChange}
                error={error}
              />
            )}
          </div>
          {isOpen && (
            <div
              className={`${isOpen ? "opacity-100" : "opacity-0"} flex gap-1.5 self-end`}
            >
              <SaveButton disabled={!!error} />
              <CancelButton onClick={handleClickOutside} />
            </div>
          )}
        </form>
      </FocusTrap>
    </div>
  );
};

export default RenameTaskForm;
