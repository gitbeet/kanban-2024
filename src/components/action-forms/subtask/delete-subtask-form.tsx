import React, { useState, useTransition } from "react";
import { deleteSubtaskAction } from "~/actions";
import { DeleteButton } from "~/components/ui/buttons";
import { useBoards } from "~/context/boards-context";

const DeleteSubtaskForm = ({
  columnId,
  taskId,
  subtaskId,
}: {
  columnId: string;
  taskId: string;
  subtaskId: string;
}) => {
  const [error, setError] = useState("");
  const { setOptimisticBoards, getCurrentBoard } = useBoards();
  const [pending, startTransition] = useTransition();
  const boardId = getCurrentBoard()?.id;
  const clientAction = async () => {
    startTransition(() => {
      setOptimisticBoards({
        action: "deleteSubtask",
        boardId,
        columnId,
        taskId,
        subtaskId,
      });
    });

    const response = await deleteSubtaskAction(subtaskId);
    if (response?.error) {
      setError(response.error);
      console.log(error);
      return;
    }
  };
  return (
    <form action={clientAction}>
      <DeleteButton />
    </form>
  );
};

export default DeleteSubtaskForm;
