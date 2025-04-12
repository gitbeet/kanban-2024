import { useUI } from "~/context/ui-context";
import PromptWindow from "../ui/modal/prompt-window";
import { Button } from "../ui/button/button";
import DeleteColumnForm from "../action-forms/column/delete-column-form";
const ConfirmDeleteColumn = () => {
  const {
    showConfirmDeleteColumnWindow,
    columnToDelete,
    setShowConfirmDeleteColumnWindow,
  } = useUI();
  const message = (
    <span>
      Are you sure you want to delete the ‘
      <span className="font-bold">{columnToDelete?.name}</span>’ column, its
      tasks and subtasks? This action cannot be reversed.
    </span>
  );

  return (
    <PromptWindow
      message={message}
      cancelButton={
        <Button
          onClick={() => setShowConfirmDeleteColumnWindow(false)}
          variant="ghost"
        >
          Go Back
        </Button>
      }
      confirmButton={
        columnToDelete ? (
          <DeleteColumnForm
            boardId={columnToDelete?.boardId}
            columnId={columnToDelete?.id}
            button={
              <Button type="submit" variant="danger">
                Delete Column
              </Button>
            }
            extraAction={() => setShowConfirmDeleteColumnWindow(false)}
          />
        ) : (
          <Button></Button>
        )
      }
      show={showConfirmDeleteColumnWindow}
      onClose={() => setShowConfirmDeleteColumnWindow(false)}
      showBackdrop={showConfirmDeleteColumnWindow}
      zIndex={50}
    />
  );
};

export default ConfirmDeleteColumn;
