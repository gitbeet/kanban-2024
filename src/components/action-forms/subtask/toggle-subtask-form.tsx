import { useTransition } from "react";
import type { FormEvent } from "react";
import { handleToggleSubtaskCompleted } from "~/server/queries";
import { ToggleButton } from "~/components/ui/button/buttons";
import { useBoards } from "~/context/boards-context";
import type { SubtaskType } from "~/types";
import { ToggleSubtaskAction } from "~/types/actions";

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
