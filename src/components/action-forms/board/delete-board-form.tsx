import React, { useState } from "react";
import { deleteBoardAction } from "~/actions";
import SubmitButton, { DeleteButton } from "~/components/ui/submit-button";
import type { BoardType, SetOptimisticType } from "~/types";
import { BoardSchema } from "~/zod-schemas";

const DeleteBoardForm = ({
  board,
  setOptimistic,
}: {
  board: BoardType;
  setOptimistic: SetOptimisticType;
}) => {
  const [error, setError] = useState("");

  const clientAction = async () => {
    // Not completely sure if check is needed
    const result = BoardSchema.shape.id.safeParse(board.id);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      console.log(error);
      return;
    }
    setOptimistic({ action: "deleteBoard", board });
    const response = await deleteBoardAction(board.id);
    if (response?.error) {
      return setError(response.error);
    }
  };
  return (
    <form action={clientAction}>
      <input type="hidden" name="board-id" value={board.id} />
      <DeleteButton />
    </form>
  );
};

export default DeleteBoardForm;
