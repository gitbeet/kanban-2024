"use client";

import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { useEffect, useState, useTransition, useRef } from "react";
import { renameTaskAction } from "~/actions";
import { CancelButton, SaveButton } from "~/components/ui/buttons";
import { useBoards } from "~/context/boards-context";
import useClickOutside from "~/hooks/useClickOutside";
import type { TaskType } from "~/types";
import { TaskSchema } from "~/zod-schemas";
import { resizeTextArea } from "~/utilities/resizeTextArea";

const RenameTaskForm = ({
  boardId,
  columnId,
  task,
  setDraggable,
}: {
  boardId: string;
  columnId: string;
  task: TaskType;
  setDraggable: Dispatch<SetStateAction<boolean>>;
}) => {
  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newTaskName, setNewTaskName] = useState(task.name);
  const [isOpen, setIsOpen] = useState(false);
  const { setOptimisticBoards } = useBoards();
  const [pending, startTransition] = useTransition();

  // Refs
  const testRef = useRef<HTMLTextAreaElement | null>(null);
  const renameTaskRef = useRef<HTMLFormElement | null>(null);
  const { ref } = useClickOutside<HTMLDivElement>(handleClickOutside);

  // Dynamic height for the textarea
  useEffect(() => resizeTextArea(testRef), [task.name, newTaskName, isOpen]);

  // Disable draggable when renaming so you can interact with the field
  useEffect(() => setDraggable(!isOpen), [isOpen, setDraggable]);

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
    const response = await renameTaskAction(task.id, newTaskName);
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
  };
  function handleClickOutside() {
    setIsOpen(false);
    setNewTaskName(task.name);
    setError("");
  }
  return (
    <div ref={ref} className={`${loading ? "pointer-events-none" : ""} `}>
      <form
        className="flex items-center gap-2"
        ref={renameTaskRef}
        onSubmit={clientAction}
      >
        <div className="relative">
          {!isOpen && (
            <div
              className="absolute z-10 h-full w-full opacity-0"
              onClick={() => {
                setIsOpen(true);
                setNewTaskName(task.name);
                testRef.current?.focus();
              }}
            ></div>
          )}
          <textarea
            rows={1}
            ref={testRef}
            readOnly={!isOpen}
            className={` ${isOpen ? "input" : "input-readonly"} ${error ? "!border-red-500" : ""} w-full resize-none overflow-hidden`}
            value={newTaskName}
            onChange={isOpen ? handleTaskNameChange : undefined}
          />
          <p className="text-right text-sm text-red-500"> {error}</p>
        </div>
        {isOpen && (
          <div
            className={`${isOpen ? "opacity-100" : "opacity-0"} flex gap-1.5`}
          >
            <SaveButton disabled={!!error} />
            <CancelButton onClick={handleClickOutside} />
          </div>
        )}
      </form>
    </div>
  );
};

export default RenameTaskForm;
