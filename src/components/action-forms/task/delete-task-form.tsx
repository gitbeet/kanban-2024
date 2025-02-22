import { useState } from "react";
import { useBoards } from "~/context/boards-context";
import { handleDeleteTask } from "~/server/queries";

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
  const clientAction = async () => {
    setOptimisticBoards({
      action: "deleteTask",
      boardId: currentBoardId,
      columnId,
      taskId,
    });

    const response = await handleDeleteTask({
      change: { action: "deleteTask", taskId },
      revalidate: true,
    });
    if (response?.error) {
      setError(response.error);
      console.log(error);
      return;
    }
    extraAction?.();
  };
  return <form action={clientAction}>{children}</form>;
};

export default DeleteTaskForm;
