import React, { useState } from "react";
import { deleteColumnAction } from "~/actions";
import { DeleteButton } from "~/components/ui/buttons";
import { useBoards } from "~/context/boards-context";
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
  const clientAction = async () => {
    // Not completely sure if check is needed
    const result = ColumnSchema.shape.id.safeParse(columnId);

    // Fix error display later
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      console.log(error);
      return;
    }
    setOptimisticBoards({ action: "deleteColumn", boardId, columnId });
    const response = await deleteColumnAction(columnId);
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
