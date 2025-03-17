"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useBoards } from "~/context/boards-context";
import useClickOutside from "~/hooks/useClickOutside";
import { handleRenameTask } from "~/server/queries";
import { resizeTextArea } from "~/utilities/resizeTextArea";
import { CancelButton, SaveButton } from "~/components/ui/button/buttons";
import { TaskSchema } from "~/zod-schemas";
import type { TaskType } from "~/types";
import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  KeyboardEvent,
  SetStateAction,
} from "react";
import TextArea from "~/components/ui/text-area";
import { handlePressEnterToSubmit } from "~/utilities/handlePressEnterOrEscape";
import FocusTrap from "focus-trap-react";
import { handlePressEscape } from "~/utilities/handlePressEscape";
import { handlePressEnter } from "~/utilities/handlePressEnter";

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
  const { ref } = useClickOutside<HTMLDivElement>(handleClickOutside);

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
      return;
    }

    startTransition(() => {
      setOptimisticBoards({
        action: "renameTask",
        boardId,
        columnId,
        taskId: task.id,
        newTaskName,
      });
    });

    // Close without waiting for server
    setIsOpen(false);

    // Server
    const response = await handleRenameTask({
      change: { action: "renameTask", newTaskName, taskId: task.id },
      revalidate: true,
    });
    if (response?.error) {
      setError(response.error);
      setLoading(false);
      // If server action fails open again
      setIsOpen(true);
      console.log("In server error");
      return;
    }

    // Wait for server to finish then set loading to false
    setLoading(false);
    textAreaRef.current?.blur();
  };

  function handleClickOutside() {
    setIsOpen(false);
    setNewTaskName(task.name);
    setError("");
    textAreaRef.current?.blur();
  }

  const handlePressEnterToEdit = async (e: KeyboardEvent) => {
    if (isOpen) {
      handlePressEscape(e, handleClickOutside);
    } else {
      await handlePressEnter(e, () => {
        setIsOpen(true);
        setNewTaskName(task.name);
      });
    }
  };

  return (
    <div
      onKeyDown={handlePressEnterToEdit}
      ref={ref}
      className={`${loading ? "pointer-events-none" : ""} `}
    >
      <FocusTrap active={isOpen}>
        <form
          className="flex flex-col gap-2"
          ref={renameTaskRef}
          onSubmit={clientAction}
        >
          <div className="relative">
            {!isOpen && (
              <div
                className="absolute z-[1] h-full w-full opacity-0"
                onClick={() => {
                  setIsOpen(true);
                  setNewTaskName(task.name);
                }}
              ></div>
            )}
            <TextArea
              ref={textAreaRef}
              rows={1}
              readOnly={!isOpen}
              className={` ${isOpen ? "input" : "input-readonly"} text-dark dark:bg-neutral-750 dark:focus:bg-neutral-950/50`}
              value={newTaskName}
              onChange={isOpen ? handleTaskNameChange : undefined}
              error={error}
              onKeyDown={async (e) => {
                if (!isOpen) return;
                await handlePressEnterToSubmit(
                  e,
                  clientAction,
                  handleClickOutside,
                );
              }}
            />
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
