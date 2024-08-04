import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { handleRenameSubtask } from "~/server/queries";
import { SaveButton } from "~/components/ui/buttons";
import { useBoards } from "~/context/boards-context";
import { SubtaskSchema } from "~/zod-schemas";

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
    e?.preventDefault();

    const result = SubtaskSchema.shape.name.safeParse(newSubtaskName);

    if (!result.success) {
      console.log(result.error.issues[0]?.message);
    }

    startTransition(() => {
      setOptimisticBoards({
        action: "renameSubtask",
        boardId: currentBoardId,
        columnId,
        taskId,
        subtaskId,
        newSubtaskName,
      });
    });

    const response = await handleRenameSubtask({
      change: { action: "renameSubtask", subtaskId, newSubtaskName },
      revalidate: true,
    });
    if (response?.error) {
      console.log(response.error);
    }
  };

  return (
    <form onSubmit={clientAction}>
      <SaveButton />
    </form>
  );
};

export default RenameSubtaskForm;
