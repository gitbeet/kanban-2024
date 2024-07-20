import React, { FormEvent, useState, useTransition } from "react";
import { deleteBoardAction } from "~/actions";
import { DeleteButton } from "~/components/ui/buttons";
import { useBoards } from "~/context/boards-context";
import { BoardSchema } from "~/zod-schemas";

const DeleteBoardForm = ({
  boardId,
  boardIndex,
}: {
  boardId: string;
  boardIndex: number;
}) => {
  const [error, setError] = useState("");
  const { setOptimisticBoards, setCurrentBoardId, optimisticBoards } =
    useBoards();
  const [pending, startTransition] = useTransition();

  const newId = optimisticBoards?.[0]?.id;

  if (!newId) return;

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();
    // Not completely sure if check is needed
    const result = BoardSchema.shape.id.safeParse(boardId);

    // Fix error display later
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      console.log(error);
      return;
    }
    startTransition(async () => {
      setOptimisticBoards({ action: "deleteBoard", boardId });
      const response = await deleteBoardAction(boardId, boardIndex);
      if (response?.error) {
        return setError(response.error);
      }
    });

    setCurrentBoardId(newId);
  };

  return (
    <form onSubmit={clientAction}>
      <input type="hidden" name="board-id" value={boardId} />
      <DeleteButton />
    </form>
  );
};

export default DeleteBoardForm;
