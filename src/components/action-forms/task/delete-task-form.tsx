import { FormEvent, startTransition, useState } from "react";
import { useBoards } from "~/context/boards-context";
import { handleDeleteTask } from "~/server/queries";
import { type DeleteTaskAction } from "~/types/actions";

const DeleteTaskForm = ({
  columnId,
  taskId,
  children,
  extraAction,
}: {
  columnId: string;
  taskId: string;
  children: React.ReactNode;
  extraAction?: () => void;
}) => {
  const [error, setError] = useState("");
  const { setOptimisticBoards, getCurrentBoard } = useBoards();
  const currentBoardId = getCurrentBoard()?.id;
  const clientAction = async (e: FormEvent) => {
    e.preventDefault();
    extraAction?.();

    if (typeof currentBoardId === "undefined") {
      setError("No current board ID");
      return;
    }

    const action: DeleteTaskAction = {
      type: "DELETE_TASK",
      payload: { boardId: currentBoardId, columnId, taskId },
    };

    startTransition(() => {
      setOptimisticBoards(action);
    });

    const response = await handleDeleteTask({
      action,
      revalidate: true,
    });
    if (response?.error) {
      setError(response.error);
      return;
    }
  };
  return <form onSubmit={clientAction}>{children}</form>;
};

export default DeleteTaskForm;
