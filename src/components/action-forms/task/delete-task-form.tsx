import { useState } from "react";
import { useBoards } from "~/context/boards-context";
import { handleDeleteTask } from "~/server/queries";

const DeleteTaskForm = ({
  columnId,
  taskId,
  children,
}: {
  columnId: string;
  taskId: string;
  children: React.ReactNode;
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
  };
  return <form action={clientAction}>{children}</form>;
};

export default DeleteTaskForm;
