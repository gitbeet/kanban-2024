import React, { type ChangeEvent, useRef, useState } from "react";
import { renameTaskAction } from "~/actions";
import InputField from "~/components/ui/input-field";
import { EditButton } from "~/components/ui/submit-button";
import { useBoards } from "~/context/boards-context";
import type { BoardType, ColumnType, TaskType } from "~/types";
import { TaskSchema } from "~/zod-schemas";

const RenameTaskForm = ({
  boardId,
  columnId,
  taskId,
}: {
  boardId: string;
  columnId: string;
  taskId: string;
}) => {
  const renameTaskRef = useRef<HTMLFormElement>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [error, setError] = useState("");
  const { setOptimisticBoards } = useBoards();
  const handleTaskNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setNewTaskName(e.target.value);
  };

  const clientAction = async () => {
    renameTaskRef.current?.reset();

    const result = TaskSchema.shape.name.safeParse(newTaskName);
    if (!result.success) {
      return setError(result.error.issues[0]?.message ?? "An error occured");
    }
    setOptimisticBoards({
      action: "renameTask",
      boardId,
      columnId,
      taskId,
      newTaskName,
    });

    const response = await renameTaskAction(taskId, newTaskName);

    if (response?.error) {
      return setError(response.error);
    }
  };
  return (
    <form className="flex" ref={renameTaskRef} action={clientAction}>
      <InputField
        value={newTaskName}
        type="text"
        name="task-name-input"
        placeholder="New name..."
        error={error}
        onChange={handleTaskNameChange}
      />
      <EditButton />
    </form>
  );
};

export default RenameTaskForm;
