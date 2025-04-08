import { FormEvent, startTransition, useState } from "react";
import { useBoards } from "~/context/boards-context";
import { handleDeleteTask } from "~/server/queries";
import { type DeleteTaskAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";

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
  const { setOptimisticBoards, getCurrentBoard } = useBoards();
  const currentBoardId = getCurrentBoard()?.id;
  const clientAction = async (e: FormEvent) => {
    e.preventDefault();
    extraAction?.();

    if (typeof currentBoardId === "undefined") {
      showCustomErrorToast({ message: "No board" });
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
    });
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
    }
  };
  return <form onSubmit={clientAction}>{children}</form>;
};

export default DeleteTaskForm;
