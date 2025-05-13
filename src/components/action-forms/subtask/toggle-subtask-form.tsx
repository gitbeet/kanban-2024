import { useTransition } from "react";
import type { FormEvent } from "react";
import { useBoards } from "~/context/boards-context";
import type { SubtaskType } from "~/types";
import { type ToggleSubtaskAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import ToggleButton from "~/components/ui/button/toggle-button";
import { handleToggleSubtaskCompleted } from "~/server/server-actions/subtask/toggle-subtask";

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

    const action: ToggleSubtaskAction = {
      type: "TOGGLE_SUBTASK",
      payload: {
        boardId: currentBoardId,
        columnId,
        taskId,
        subtaskId: subtask.id,
      },
    };

    startTransition(() => {
      setOptimisticBoards(action);
    });

    const response = await handleToggleSubtaskCompleted({
      action,
    });
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
    }
  };
  return (
    <form onSubmit={clientAction}>
      <ToggleButton checked={subtask.completed} />
    </form>
  );
};

export default ToggleSubtaskForm;
