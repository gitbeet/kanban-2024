import React, { useState } from "react";
import { deleteBoardAction } from "~/actions";
import { DeleteButton } from "~/components/ui/submit-button";
import { useBoards } from "~/context/boards-context";
import type { BoardType } from "~/types";
import { BoardSchema } from "~/zod-schemas";

const DeleteBoardForm = ({ board }: { board: BoardType }) => {
  const [error, setError] = useState("");
  const { setOptimisticBoards } = useBoards();

  const clientAction = async () => {
    // Not completely sure if check is needed
    const result = BoardSchema.shape.id.safeParse(board.id);

    // Fix error display later
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      console.log(error);
      return;
    }
    setOptimisticBoards({ action: "deleteBoard", board });
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
