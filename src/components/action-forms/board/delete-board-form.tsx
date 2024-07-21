import { useEffect, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { deleteBoardAction } from "~/actions";
import { DeleteButton } from "~/components/ui/buttons";
import { BoardSchema } from "~/zod-schemas";
import type { FormEvent } from "react";

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
  const {
    setOptimisticBoards,
    optimisticBoards,
    setLoading: setBoardsLoading,
    getCurrentBoard,
  } = useBoards();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setBoardsLoading((prev) => ({ ...prev, deleteBoard: pending }));
  }, [pending, setBoardsLoading]);

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
    startTransition(() => {
      setOptimisticBoards({ action: "deleteBoard", boardId });
    });

    const wasCurrent = boardId === getCurrentBoard()?.id;
    const response = await deleteBoardAction(boardId, boardIndex, wasCurrent);
    if (response?.error) {
      return setError(response.error);
    }
  };

  return (
    <form onSubmit={clientAction} className={props.className}>
      <DeleteButton />
    </form>
  );
};

export default DeleteBoardForm;
