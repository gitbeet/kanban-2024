import { useEffect, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { DeleteButton } from "~/components/ui/button/buttons";
import { BoardSchema } from "~/zod-schemas";
import type { FormEvent } from "react";
import { handleDeleteBoard } from "~/server/queries";
import { useUser } from "@clerk/nextjs";
import { DeleteBoardUpdate } from "~/types/updates";

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
  const {
    setOptimisticBoards,
    setLoading: setBoardsLoading,
    getCurrentBoard,
  } = useBoards();
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
    startTransition(() => {
      setOptimisticBoards({
        action: "deleteBoard",
        payload: { boardId, boardIndex, wasCurrent },
      });
    });

    const args = {
      change: {
        action: "deleteBoard",
        payload: { boardId, boardIndex, wasCurrent },
      } as DeleteBoardUpdate,
      userId: user.id,
      revalidate: true,
    };
    const response = await handleDeleteBoard(args);
    if (response?.error) {
      return setError(response.error);
    }
  };

  return (
    <form onSubmit={clientAction} className={props.className}>
      {button ?? <DeleteButton />}
    </form>
  );
};

export default DeleteBoardForm;
