import DeleteTaskForm from "~/components/action-forms/task/delete-task-form";
import { Button } from "~/components/ui/button/buttons";
import PromptWindow from "~/components/ui/modal/prompt-window";
import { useUI } from "~/context/ui-context";
import { type TaskType } from "~/types";

const ConfirmDeleteTaskWindow = ({
  task,
  columnId,
}: {
  task: TaskType;
  columnId: string;
}) => {
  const {
    showConfirmDeleteTaskWindow,
    setShowConfirmDeleteTaskWindow,
    setShowEditTaskMenu,
    setShowEditTaskWindow,
    setShowEditTaskSmallMenu,
  } = useUI();

  const handleOnDeleteTask = () => {
    setShowConfirmDeleteTaskWindow(false);
    setShowEditTaskMenu(false);
    setShowEditTaskWindow(false);
    setShowEditTaskSmallMenu(false);
  };

  const handleCloseModal = () => {
    setShowConfirmDeleteTaskWindow(false);
  };

  const displayedTaskName =
    task.name.length > 30 ? `${task.name.slice(0, 30)}...` : task.name;

  return (
    <>
      <PromptWindow
        zIndex={40}
        showBackdrop={showConfirmDeleteTaskWindow}
        show={showConfirmDeleteTaskWindow}
        onClose={handleCloseModal}
        message={
          <>
            Are you sure you want to delete the ‘
            <span className="font-bold">{displayedTaskName}</span>’ task and its
            subtasks? This action cannot be reversed.
          </>
        }
        confirmButton={
          <DeleteTaskForm
            columnId={columnId}
            taskId={task.id}
            extraAction={handleOnDeleteTask}
          >
            <Button type="submit" variant="danger">
              Delete Task
            </Button>
          </DeleteTaskForm>
        }
        cancelButton={
          <Button onClick={handleCloseModal} variant="ghost">
            Cancel
          </Button>
        }
      />
    </>
  );
};

export default ConfirmDeleteTaskWindow;
