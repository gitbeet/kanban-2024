import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { SaveButton } from "~/components/ui/button/buttons";
import { useBoards } from "~/context/boards-context";
import type { SubtaskType } from "~/types";
import { SubtaskSchema } from "~/zod-schemas";
import { v4 as uuid } from "uuid";
import { handleCreateSubtask } from "~/server/queries";
const CreateSubtaskForm = ({
  columnId,
  taskId,
}: {
  columnId: string;
  taskId: string;
}) => {
  const [pending, startTransition] = useTransition();
  const { setOptimisticBoards, getCurrentBoard } = useBoards();
  const currentBoard = getCurrentBoard();

  const [subtaskName, setSubtaskName] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const clientAction = async (e?: FormEvent) => {
    if (!currentBoard) {
      setError("No current board");
      return;
    }
    e?.preventDefault();

    // client validation
    // client state update

    const currentTask = currentBoard.columns
      .find((column) => column.id === columnId)
      ?.tasks.find((task) => task.id === taskId);

    const maxIndex = !currentTask?.subtasks.length
      ? 0
      : currentTask?.subtasks.length;

    const newSubtask: SubtaskType = {
      id: uuid(),
      index: maxIndex + 1,
      name: `Test subtask ${maxIndex + 1}`,
      completed: false,
      taskId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = SubtaskSchema.safeParse(newSubtask);
    if (!result.success) {
      setIsOpen(true);
      setError(result.error.issues[0]?.message ?? "An error occured");
      return;
    }

    startTransition(() => {
      setOptimisticBoards({
        action: "createSubtask",
        boardId: currentBoard?.id,
        columnId,
        taskId,
        subtask: newSubtask,
      });
    });

    // sever validation/state update
    const response = await handleCreateSubtask({
      change: {
        action: "createSubtask",
        payload: {
          boardId: currentBoard.id,
          columnId,
          taskId,
          subtask: newSubtask,
        },
      },
      revalidate: true,
    });
    if (response?.error) {
      setIsOpen(true);
      setError(response.error);
      return;
    }
    setSubtaskName("");
  };

  return (
    <form onSubmit={clientAction}>
      <SaveButton type="submit" />
    </form>
  );
};

export default CreateSubtaskForm;
