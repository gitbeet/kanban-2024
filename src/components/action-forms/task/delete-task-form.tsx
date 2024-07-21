import { useState } from "react";
import { useBoards } from "~/context/boards-context";
import { deleteTaskAction } from "~/actions";
import { DeleteButton } from "~/components/ui/buttons";

const DeleteTaskForm = ({
  columnId,
  taskId,
}: {
  columnId: string;
  taskId: string;
}) => {
  const [error, setError] = useState("");
  const { setOptimisticBoards, getCurrentBoard } = useBoards();
  const currentBoardId = getCurrentBoard()?.id;
  const clientAction = async () => {
    setOptimisticBoards({
      action: "deleteTask",
      boardId: currentBoardId,
      columnId,
      taskId,
    });

    const response = await deleteTaskAction(taskId);
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

export default DeleteTaskForm;
