import { useTransition } from "react";
import type { FormEvent } from "react";
import { handleToggleSubtaskCompleted } from "~/server/queries";
import { ToggleButton } from "~/components/ui/button/buttons";
import { useBoards } from "~/context/boards-context";
import type { SubtaskType } from "~/types";

const ToggleSubtaskForm = ({
  columnId,
  taskId,
  subtask,
}: {
  columnId: string;
  taskId: string;
  subtask: SubtaskType;
}) => {
  const [pending, startTransition] = useTransition();
  const { setOptimisticBoards, getCurrentBoard } = useBoards();
  const currentBoardId = getCurrentBoard()?.id;

  const clientAction = async (e?: FormEvent) => {
    if (!currentBoardId) {
      return;
    }
    e?.preventDefault();
    startTransition(() => {
      setOptimisticBoards({
        action: "toggleSubtask",
        boardId: currentBoardId,
        columnId,
        taskId,
        subtaskId: subtask.id,
      });
    });

    const response = await handleToggleSubtaskCompleted({
      change: {
        action: "toggleSubtask",
        payload: {
          boardId: currentBoardId,
          columnId,
          taskId,
          subtaskId: subtask.id,
        },
      },
      revalidate: true,
    });
    if (response?.error) {
      console.log(response.error);
    }
  };
  return (
    <form onSubmit={clientAction}>
      <ToggleButton checked={subtask.completed} />
    </form>
  );
};

export default ToggleSubtaskForm;
