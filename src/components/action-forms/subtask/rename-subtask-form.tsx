import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { useBoards } from "~/context/boards-context";
import { SubtaskSchema } from "~/utilities/zod-schemas";
import { type RenameSubtaskAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import SaveButton from "~/components/ui/button/save-button";
import { handleRenameSubtask } from "~/server/server-actions/subtask/rename-subtask";

const RenameSubtaskForm = ({
  columnId,
  taskId,
  subtaskId,
}: {
  columnId: string;
  taskId: string;
  subtaskId: string;
}) => {
  const [pending, startTransition] = useTransition();
  const [newSubtaskName, setNewSubtaskName] = useState("Rename form test");
  const { setOptimisticBoards, getCurrentBoard } = useBoards();
  const currentBoardId = getCurrentBoard()?.id;
  const clientAction = async (e?: FormEvent) => {
    if (!currentBoardId) {
      return;
    }
    e?.preventDefault();

    const result = SubtaskSchema.shape.name.safeParse(newSubtaskName);

    if (!result.success) {
      console.log(result.error.issues[0]?.message);
    }

    const action: RenameSubtaskAction = {
      type: "RENAME_SUBTASK",
      payload: {
        boardId: currentBoardId,
        columnId,
        taskId,
        subtaskId,
        newSubtaskName,
      },
    };

    startTransition(() => {
      setOptimisticBoards(action);
    });

    const response = await handleRenameSubtask({
      action,
    });
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
    }
  };

  return (
    <form onSubmit={clientAction}>
      <SaveButton />
    </form>
  );
};

export default RenameSubtaskForm;
