import { type FormEvent, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { handleDeleteColumn } from "~/server/queries";
import { ColumnSchema } from "~/utilities/zod-schemas";
import type { DeleteColumnAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import DeleteButton from "~/components/ui/button/delete-button";

const DeleteColumnForm = ({
  boardId,
  columnId,
  button,
  extraAction,
}: {
  boardId: string;
  columnId: string;
  button?: JSX.Element;
  extraAction?: () => void;
}) => {
  const [error, setError] = useState("");
  const { setOptimisticBoards } = useBoards();
  const [pending, startTransition] = useTransition();
  const clientAction = async (e: FormEvent) => {
    e.preventDefault();
    extraAction?.();

    //client validation
    const result = ColumnSchema.shape.id.safeParse(columnId);
    // Fix error display later
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      return;
    }

    const action: DeleteColumnAction = {
      type: "DELETE_COLUMN",
      payload: { boardId, columnId },
    };

    startTransition(() => setOptimisticBoards(action));

    const response = await handleDeleteColumn({
      action,
    });
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
    }
  };
  return <form onSubmit={clientAction}>{button ?? <DeleteButton />}</form>;
};

export default DeleteColumnForm;
