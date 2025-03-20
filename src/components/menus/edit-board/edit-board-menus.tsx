import EditBoard from "./edit-board";
import { useBoards } from "~/context/boards-context";
import ConfirmDeleteBoardWindow from "./confirm-delete-board-window";

const EditBoardMenus = () => {
  const { getCurrentBoard } = useBoards();
  const board = getCurrentBoard();
  if (!board) return null;
  return (
    <>
      <EditBoard board={board} />
      <ConfirmDeleteBoardWindow />
    </>
  );
};

export default EditBoardMenus;
