import React, { useState } from "react";
import { deleteBoardAction } from "~/actions";
import { DeleteButton } from "~/components/ui/submit-button";
import { useBoards } from "~/context/boards-context";
import { BoardSchema } from "~/zod-schemas";

const DeleteBoardForm = ({ boardId }: { boardId: string }) => {
  const [error, setError] = useState("");
  const { setOptimisticBoards } = useBoards();

  const clientAction = async () => {
    // Not completely sure if check is needed
    const result = BoardSchema.shape.id.safeParse(boardId);

    // Fix error display later
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      console.log(error);
      return;
    }
    setOptimisticBoards({ action: "deleteBoard", boardId });
    const response = await deleteBoardAction(boardId);
    if (response?.error) {
      return setError(response.error);
    }
  };

  return (
    <form action={clientAction}>
      <input type="hidden" name="board-id" value={boardId} />
      <DeleteButton />
    </form>
  );
};

export default DeleteBoardForm;
