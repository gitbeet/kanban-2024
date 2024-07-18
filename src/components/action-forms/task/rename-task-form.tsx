"use client";

import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { useEffect, useState, useTransition, useRef } from "react";
import { renameTaskAction } from "~/actions";
import { CancelButton, SaveButton } from "~/components/ui/submit-button";
import { useBoards } from "~/context/boards-context";
import useClickOutside from "~/hooks/useClickOutside";
import type { TaskType } from "~/types";
import { TaskSchema } from "~/zod-schemas";

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
  const renameTaskRef = useRef<HTMLFormElement>(null);
  const [newTaskName, setNewTaskName] = useState(task.name);
  const [error, setError] = useState("");
  const { setOptimisticBoards } = useBoards();
  const [_, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => {
    if (error) return;
    setIsOpen(false);
  });
  const [loading, setLoading] = useState(false);

  const handleTaskNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setNewTaskName(e.target.value);
  };

  const clientAction = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

    const response = await renameTaskAction(task.id, newTaskName);

    if (response?.error) {
      setError(response.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    setIsOpen(false);
  };

  const testRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextArea = () => {
    if (!testRef.current) return;
    testRef.current.style.height = "auto";
    testRef.current.style.height = testRef.current.scrollHeight + "px";
  };

  useEffect(resizeTextArea, [task.name, newTaskName, isOpen]);
  useEffect(() => setDraggable(!isOpen), [isOpen, setDraggable]);
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
            className={` ${isOpen ? "input !bg-neutral-800" : "input-readonly"} ${error ? "!border-red-500" : ""} input w-full resize-none overflow-hidden`}
            value={newTaskName}
            onChange={isOpen ? handleTaskNameChange : undefined}
          />
          <p className="text-right text-sm text-red-500"> {error}</p>
        </div>
        <div
          className={`${isOpen ? "opacity-100" : "opacity-0"} flex flex-col gap-2`}
        >
          <SaveButton error={error} />
          <CancelButton
            onClick={() => {
              setError("");
              setIsOpen(false);
              setNewTaskName(task.name);
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default RenameTaskForm;
