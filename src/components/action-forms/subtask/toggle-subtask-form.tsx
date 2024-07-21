import { useTransition, type FormEvent } from "react";
import { toggleSubtaskCompletedAction } from "~/actions";
import { ToggleButton } from "~/components/ui/buttons";
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

    const response = await toggleSubtaskCompletedAction(subtask.id);
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
