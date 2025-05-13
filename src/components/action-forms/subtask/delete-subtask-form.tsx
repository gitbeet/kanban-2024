import { useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { type DeleteSubtaskAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import DeleteButton from "~/components/ui/button/delete-button";
import { handleDeleteSubtask } from "~/server/server-actions/subtask/delete-subtask";

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
    if (!boardId) {
      setError("No board id found");
      return;
    }

    const action: DeleteSubtaskAction = {
      type: "DELETE_SUBTASK",
      payload: { boardId, columnId, taskId, subtaskId },
    };

    startTransition(() => {
      setOptimisticBoards(action);
    });
    const response = await handleDeleteSubtask({
      action,
    });
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
    }
  };
  return (
    <form action={clientAction}>
      <DeleteButton />
    </form>
  );
};

export default DeleteSubtaskForm;
