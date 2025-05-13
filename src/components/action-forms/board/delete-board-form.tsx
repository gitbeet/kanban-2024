import { useEffect, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { BoardSchema } from "~/utilities/zod-schemas";
import type { FormEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { type DeleteBoardAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import DeleteButton from "~/components/ui/button/delete-button";
import { handleDeleteBoard } from "~/server/server-actions/board/delete-board";

interface DeleteTaskFormProps extends React.HTMLAttributes<HTMLDivElement> {
  boardId: string;
  boardIndex: number;
  button?: React.ReactElement<JSX.IntrinsicElements["button"]>;
  externalAction?: () => void;
}

const DeleteBoardForm = ({
  boardId,
  boardIndex,
  button,
  externalAction,
  ...props
}: DeleteTaskFormProps) => {
  const [error, setError] = useState("");
  const { user } = useUser();
  const { setOptimisticBoards, setBoardsLoading, getCurrentBoard } =
    useBoards();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setBoardsLoading((prev) => ({ ...prev, deleteBoard: pending }));
  }, [pending, setBoardsLoading]);

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();
    externalAction?.();
    if (!user?.id) return;

    // Not completely sure if check is needed
    const result = BoardSchema.shape.id.safeParse(boardId);

    // Fix error display later
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      console.log(error);
      return;
    }
    const wasCurrent = boardId === getCurrentBoard()?.id;

    const action: DeleteBoardAction = {
      type: "DELETE_BOARD",
      payload: { boardId, boardIndex, wasCurrent },
    };

    startTransition(() => {
      setOptimisticBoards(action);
    });

    const response = await handleDeleteBoard({
      action,
    });
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
    }
  };

  return (
    <form onSubmit={clientAction} className={props.className}>
      {button ?? <DeleteButton />}
    </form>
  );
};

export default DeleteBoardForm;
