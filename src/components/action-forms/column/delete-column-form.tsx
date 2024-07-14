import React, { useState } from "react";
import { deleteColumnAction } from "~/actions";
import { DeleteButton } from "~/components/ui/submit-button";
import type { BoardType, ColumnType, SetOptimisticType } from "~/types";
import { ColumnSchema } from "~/zod-schemas";

const DeleteColumnForm = ({
  board,
  column,
  setOptimistic,
}: {
  board: BoardType;
  column: ColumnType;
  setOptimistic: SetOptimisticType;
}) => {
  const [error, setError] = useState("");

  const clientAction = async () => {
    // Not completely sure if check is needed
    const result = ColumnSchema.shape.id.safeParse(column.id);

    // Fix error display later
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      console.log(error);
      return;
    }
    setOptimistic({ action: "deleteColumn", board, column });
    const response = await deleteColumnAction(column.id);
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
