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
    showEditTaskMenu,
    showEditTaskSmallMenu,
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

  return (
    <>
      <PromptWindow
        zIndex={40}
        showBackdrop={
          showConfirmDeleteTaskWindow &&
          showEditTaskMenu &&
          showEditTaskSmallMenu
        }
        show={showConfirmDeleteTaskWindow}
        onClose={() => setShowConfirmDeleteTaskWindow(false)}
        message={
          <span>
            Are you sure you want to delete the ‘
            <span className="font-bold">{task.name}</span>’ task and its
            subtasks? This action cannot be reversed.
          </span>
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
          <Button
            onClick={() => setShowConfirmDeleteTaskWindow(false)}
            variant="ghost"
          >
            Cancel
          </Button>
        }
      />
    </>
  );
};

export default ConfirmDeleteTaskWindow;
