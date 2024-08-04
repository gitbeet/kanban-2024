import { useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { handleDeleteColumn } from "~/server/queries";
import { DeleteButton } from "~/components/ui/buttons";
import { ColumnSchema } from "~/zod-schemas";

const DeleteColumnForm = ({
  boardId,
  columnId,
}: {
  boardId: string;
  columnId: string;
}) => {
  const [error, setError] = useState("");
  const { setOptimisticBoards } = useBoards();
  const [pending, startTransition] = useTransition();
  const clientAction = async () => {
    // Not completely sure if check is needed
    const result = ColumnSchema.shape.id.safeParse(columnId);

    // Fix error display later
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      console.log(error);
      return;
    }

    startTransition(() =>
      setOptimisticBoards({ action: "deleteColumn", boardId, columnId }),
    );

    const response = await handleDeleteColumn({
      change: { action: "deleteColumn", columnId },
      revalidate: true,
    });
    if (response?.error) {
      return setError(response.error);
    }
  };
  return (
    <form action={clientAction}>
      <DeleteButton />
    </form>
  );
};

export default DeleteColumnForm;
