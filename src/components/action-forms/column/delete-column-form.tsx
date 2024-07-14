import React, { useState } from "react";
import { deleteColumnAction } from "~/actions";
import { DeleteButton } from "~/components/ui/submit-button";
import { useBoards } from "~/context/boards-context";
import type { BoardType, ColumnType } from "~/types";
import { ColumnSchema } from "~/zod-schemas";

const DeleteColumnForm = ({
  board,
  column,
}: {
  board: BoardType;
  column: ColumnType;
}) => {
  const [error, setError] = useState("");
  const { setOptimisticBoards } = useBoards();
  const clientAction = async () => {
    // Not completely sure if check is needed
    const result = ColumnSchema.shape.id.safeParse(column.id);

    // Fix error display later
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      console.log(error);
      return;
    }
    setOptimisticBoards({ action: "deleteColumn", board, column });
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
