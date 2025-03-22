import { useEffect, useRef, useState, useTransition } from "react";
import {
  Button,
  MoreButton,
  ToggleButton,
} from "~/components/ui/button/buttons";
import { ModalWithBackdrop } from "~/components/ui/modal/modal";
import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";
import { mutateTable } from "~/server/queries";
import type { SubtaskType, TaskType } from "~/types";
import EditTaskSmallMenu from "./edit-task-small-menu";
import type {
  Action,
  SwitchTaskColumnAction,
  ToggleSubtaskAction,
} from "~/types/actions";
import PromptWindow from "~/components/ui/modal/prompt-window";

const EditTaskWindow = ({
  task,
  columnId,
}: {
  task: TaskType;
  columnId: string;
}) => {
  const {
    showEditTaskMenu,
    showEditTaskSmallMenu,
    showEditTaskWindow,
    setShowEditTaskMenu,
    setEditedTask,
    setShowEditTaskSmallMenu,
  } = useUI();
  const { getCurrentBoard, setOptimisticBoards } = useBoards();

  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [newColumnId, setNewColumnId] = useState(columnId);
  const [newTaskIndex, setNewTaskIndex] = useState(task.index);
  const [temporarySubtasks, setTemporarySubtasks] = useState(task.subtasks);
  const [showConfirmationModal, setShowConfirmationModal] = useState<{
    show: boolean;
    type: "closeButton" | "moreButton" | null;
  }>({ show: false, type: null });

  useEffect(() => {
    setTemporarySubtasks(task.subtasks);
  }, [task]);

  const board = getCurrentBoard();
  if (!board) return <div>No board</div>;

  const handleToggleTemporarySubtask = (subtaskId: SubtaskType["id"]) => {
    setTemporarySubtasks((prev) =>
      prev.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask,
      ),
    );
  };

  const getToggleSubtaskActions = () => {
    const toggleSubtaskActions: ToggleSubtaskAction[] = [];
    const changedSubtasks = temporarySubtasks.filter((temporarySubtask) => {
      const originalSubtask = task.subtasks.find(
        (sub) => sub.id === temporarySubtask.id,
      );
      return (
        originalSubtask &&
        originalSubtask.completed !== temporarySubtask.completed
      );
    });
    changedSubtasks.forEach((subtask) =>
      toggleSubtaskActions.push({
        type: "TOGGLE_SUBTASK",
        payload: {
          boardId: board?.id,
          columnId,
          taskId: task.id,
          subtaskId: subtask.id,
        },
      }),
    );
    return toggleSubtaskActions;
  };

  const getSwitchColumnAction = () => {
    const isColumnChanged = task.columnId !== newColumnId;
    const isIndexChanged = task.index !== newTaskIndex;
    if (!isColumnChanged && !isIndexChanged) return;
    const adjustedNewIndex =
      task.index < newTaskIndex && columnId === newColumnId
        ? newTaskIndex + 1
        : newTaskIndex;
    const switchColumnAction: SwitchTaskColumnAction = {
      type: "SWITCH_TASK_COLUMN",
      payload: {
        boardId: board.id,
        taskId: task.id,
        oldColumnId: task.columnId,
        newColumnId,
        oldColumnIndex: task.index,
        newColumnIndex: adjustedNewIndex,
      },
    };
    return switchColumnAction;
  };

  const getActions = () => {
    const toggleSubtaskActions = getToggleSubtaskActions();
    const switchColumnAction = getSwitchColumnAction();
    const actions: Action[] = [];
    if (!toggleSubtaskActions && !switchColumnAction) {
      return [];
    }
    if (toggleSubtaskActions) {
      actions.push(...toggleSubtaskActions);
    }
    if (switchColumnAction) {
      actions.push(switchColumnAction);
    }
    return actions;
  };

  const resetState = () => {
    setNewColumnId(columnId);
    setNewTaskIndex(task.index);
    setTemporarySubtasks(task.subtasks);
  };

  const handleClickOutside = () => {
    if (showEditTaskWindow || showEditTaskSmallMenu) return;
    const actions = getActions();
    if (actions.length === 0) {
      setEditedTask({ columnId: null, taskId: null });
      setShowEditTaskMenu(false);
      return;
    }
    setShowConfirmationModal({ show: true, type: "closeButton" });
  };

  const handleClickMoreMenu = () => {
    const actions = getActions();
    if (!actions.length) {
      setShowEditTaskSmallMenu(true);
    } else {
      setShowConfirmationModal({ show: true, type: "moreButton" });
    }
  };

  const handleClickDiscardChanges = () => {
    setShowConfirmationModal({ show: false, type: null });
    setShowEditTaskSmallMenu(true);
    resetState();
  };

  const handleClickCloseAnyway = () => {
    setShowEditTaskMenu(false);
    setShowEditTaskSmallMenu(false);
    setShowConfirmationModal({ show: false, type: null });
    setEditedTask({ columnId: null, taskId: null });
    resetState();
  };

  const handleSaveChanges = async () => {
    const actions = getActions();
    // updating editedTask when switching column so the menu does not disappear
    setEditedTask({ columnId: newColumnId, taskId: task.id });
    startTransition(() => {
      actions.forEach((action) => setOptimisticBoards(action));
    });
    const response = await mutateTable(actions);
    if (response?.error) {
      console.log("Error occured while saving changes");
    }
  };

  const smallMenu = (
    <EditTaskSmallMenu
      position={{
        x: moreButtonRef.current?.getBoundingClientRect().left ?? 0,
        y: moreButtonRef.current?.getBoundingClientRect().top ?? 0,
      }}
    />
  );

  const confirmationModal = (
    <PromptWindow
      show={showConfirmationModal.show}
      showBackdrop={showConfirmationModal.show}
      zIndex={90}
      message="Save your changes before proceding. All unsaved changes will be lost."
      onClose={() => setShowConfirmationModal({ show: false, type: null })}
      confirmButton={
        <Button
          onClick={
            showConfirmationModal.type === "moreButton"
              ? handleClickDiscardChanges
              : handleClickCloseAnyway
          }
          variant="danger"
        >
          {showConfirmationModal.type === "moreButton"
            ? "Discard changes"
            : "Close anyway"}
        </Button>
      }
      cancelButton={
        <Button
          onClick={() => setShowConfirmationModal({ show: false, type: null })}
          variant="ghost"
        >
          Go back
        </Button>
      }
    />
  );

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const allSubtasks = task.subtasks.length;
  let positionsAvailable = board?.columns.find((col) => col.id === newColumnId)
    ?.tasks.length;
  if (
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    (newColumnId !== task.columnId && positionsAvailable) ||
    positionsAvailable === 0
  )
    positionsAvailable++;
  const positionsArr = Array.from(
    { length: positionsAvailable ?? 1 },
    (e, i) => i,
  );

  return (
    <>
      {smallMenu}
      {confirmationModal}
      <ModalWithBackdrop
        zIndex={20}
        show={showEditTaskMenu}
        showBackdrop={
          showEditTaskMenu && !showEditTaskSmallMenu && !showEditTaskWindow
        }
        onClose={handleClickOutside}
        className="flex max-h-[95dvh] flex-col gap-8 overflow-auto"
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-dark truncate text-xl font-bold">{task.name}</h3>
          <MoreButton ref={moreButtonRef} onClick={handleClickMoreMenu} />
        </div>
        <div className="space-y-4">
          <h4 className="text-light text-sm font-bold">
            {allSubtasks < 1
              ? "No subtasks"
              : `Subtasks ( ${completedSubtasks} of ${allSubtasks} )`}
          </h4>

          <ul className="max-h-56 space-y-2 overflow-auto">
            {temporarySubtasks
              .sort((a, b) => a.index - b.index)
              .map((subtask) => (
                <li
                  key={subtask.index}
                  className="bg-dark flex items-center gap-3 p-3 text-sm font-bold"
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleToggleTemporarySubtask(subtask.id);
                    }}
                  >
                    <input
                      readOnly
                      type="hidden"
                      name="task-completed"
                      checked={task.completed ? true : false}
                      value={task.completed ? "true" : "false"}
                    />
                    <ToggleButton checked={subtask.completed} />
                  </form>
                  <span
                    className={`${
                      subtask.completed
                        ? "text-secondary line-through"
                        : "text-dark"
                    } truncate`}
                  >
                    {subtask.name}
                  </span>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h4 className="text-dark text-sm font-bold">Column</h4>
          <div className="h-4" />
          <select
            disabled={pending || loading}
            onChange={(e) => {
              setNewColumnId(e.target.value);
            }}
            value={newColumnId}
          >
            {board?.columns?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h4 className="text-dark text-sm font-bold">Position</h4>
          <div className="h-4" />
          <select
            disabled={pending || loading}
            onChange={(e) => {
              setNewTaskIndex(parseInt(e.target.value));
            }}
            value={newTaskIndex}
          >
            {positionsArr.map((c) => (
              <option key={c + 1} value={c + 1}>
                {c + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            disabled={getActions().length === 0}
            onClick={handleSaveChanges}
          >
            Save changes
          </Button>
          <Button variant="danger" onClick={handleClickOutside}>
            Close
          </Button>
        </div>
      </ModalWithBackdrop>
    </>
  );
};

export default EditTaskWindow;
