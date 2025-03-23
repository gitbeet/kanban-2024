import { useState, useTransition } from "react";
import { handleDeleteSubtask } from "~/server/queries";
import { DeleteButton } from "~/components/ui/button/buttons";
import { useBoards } from "~/context/boards-context";
import { DeleteSubtaskAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";

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
      revalidate: true,
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
