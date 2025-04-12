import DeleteBoardForm from "~/components/action-forms/board/delete-board-form";
import { Button } from "~/components/ui/button/button";
import PromptWindow from "~/components/ui/modal/prompt-window";
import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";

const ConfirmDeleteBoardWindow = () => {
  const {
    setShowEditBoardWindow,
    showConfirmDeleteBoardWindow,
    setShowConfirmDeleteBoardWindow,
  } = useUI();
  const { getCurrentBoard } = useBoards();
  const currentBoard = getCurrentBoard();

  if (!currentBoard) return null;

  return (
    <PromptWindow
      cancelButton={
        <Button
          variant="ghost"
          onClick={() => setShowConfirmDeleteBoardWindow(false)}
        >
          Cancel
        </Button>
      }
      confirmButton={
        <DeleteBoardForm
          boardId={currentBoard.id}
          boardIndex={currentBoard.index}
          button={
            <Button type="submit" variant="danger">
              Delete Board
            </Button>
          }
          externalAction={() => {
            setShowConfirmDeleteBoardWindow(false);
            setShowEditBoardWindow(false);
          }}
        />
      }
      onClose={() => setShowConfirmDeleteBoardWindow(false)}
      show={showConfirmDeleteBoardWindow}
      showBackdrop={showConfirmDeleteBoardWindow}
      zIndex={50}
      message={
        <span>
          Are you sure you want to delete the ‘
          <span className="font-bold">{currentBoard?.name}</span>’ board ,all
          its tasks and subtasks? This action cannot be reversed.
        </span>
      }
    />
  );
};

export default ConfirmDeleteBoardWindow;
