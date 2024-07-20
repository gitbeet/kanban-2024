import React, { FormEvent, useState, useTransition } from "react";
import { deleteBoardAction } from "~/actions";
import { DeleteButton } from "~/components/ui/buttons";
import { useBoards } from "~/context/boards-context";
import { BoardSchema } from "~/zod-schemas";

interface DeleteTaskFormProps extends React.HTMLAttributes<HTMLDivElement> {
  boardId: string;
  boardIndex: number;
}

const DeleteBoardForm = ({
  boardId,
  boardIndex,
  ...props
}: DeleteTaskFormProps) => {
  const [error, setError] = useState("");
  const { setOptimisticBoards, setCurrentBoardId, optimisticBoards } =
    useBoards();
  const [pending, startTransition] = useTransition();

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
    });

    const response = await deleteBoardAction(boardId, boardIndex);
    if (response?.error) {
      return setError(response.error);
    }

    startTransition(() => {
      const updatedBoards = optimisticBoards.filter(
        (board) => board.id !== boardId,
      );
      if (updatedBoards.length > 0) {
        if (!updatedBoards[0]) return;
        setCurrentBoardId(updatedBoards[0].id);
      } else {
        setCurrentBoardId("");
      }
    });
  };

  return (
    <form onSubmit={clientAction} className={props.className}>
      <DeleteButton />
    </form>
  );
};

export default DeleteBoardForm;
