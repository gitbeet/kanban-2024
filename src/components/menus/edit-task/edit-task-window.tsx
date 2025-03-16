import { type ChangeEvent, useRef, useState, useTransition } from "react";
import ToggleSubtaskForm from "~/components/action-forms/subtask/toggle-subtask-form";
import { Button, MoreButton } from "~/components/ui/button/buttons";
import { ModalWithBackdrop } from "~/components/ui/modal/modal";
import { useBoards } from "~/context/boards-context";
import { useUI } from "~/context/ui-context";
import { handleSwitchTaskColumn } from "~/server/queries";
import { type TaskType } from "~/types";
import EditTaskSmallMenu from "./edit-task-small-menu";

const EditTaskWindow = ({
  task,
  columnId,
}: {
  task: TaskType;
  columnId: string;
}) => {
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const { getCurrentBoard, setOptimisticBoards } = useBoards();
  const {
    showEditTaskMenu,
    showEditTaskSmallMenu,
    showEditTaskWindow,
    setShowEditTaskMenu,
    setEditedTask,
    setShowEditTaskSmallMenu,
  } = useUI();

  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const [newColumnId, setNewColumnId] = useState(columnId);
  const [newTaskIndex, setNewTaskIndex] = useState(task.index);

  const board = getCurrentBoard();

  const handleClickOutside = () => {
    if (showEditTaskWindow || showEditTaskSmallMenu) return;
    setEditedTask({ columnId: null, taskId: null });
    setShowEditTaskMenu(false);
  };

  const handleColumnChange = async () => {
    setLoading(true);
    if (newColumnId === columnId && newTaskIndex === task.index)
      return handleClickOutside();
    const adjustedNewIndex =
      task.index < newTaskIndex && columnId === newColumnId
        ? newTaskIndex + 1
        : newTaskIndex;
    setOptimisticBoards({
      action: "switchTaskColumn",
      boardId: board?.id,
      taskId: task.id,
      oldColumnId: columnId,
      newColumnId: newColumnId,
      oldColumnIndex: task.index,
      newColumnIndex: adjustedNewIndex,
    });
    handleClickOutside();
    const response = await handleSwitchTaskColumn({
      change: {
        action: "switchTaskColumn",
        taskId: task.id,
        oldColumnId: columnId,
        newColumnId: newColumnId,
        oldColumnIndex: task.index,
        newColumnIndex: adjustedNewIndex,
      },
      revalidate: true,
    });

    if (response?.error) {
      console.log(response.error);
      return setLoading(false);
    }
    setLoading(false);
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const allSubtasks = task.subtasks.length;

  const smallMenu = (
    <EditTaskSmallMenu
      position={{
        x: moreButtonRef.current?.getBoundingClientRect().left ?? 0,
        y: moreButtonRef.current?.getBoundingClientRect().top ?? 0,
      }}
    />
  );

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
      <ModalWithBackdrop
        zIndex={20}
        show={showEditTaskMenu}
        showBackdrop={
          showEditTaskMenu && !showEditTaskSmallMenu && !showEditTaskWindow
        }
        onClose={handleClickOutside}
        className="flex flex-col gap-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-dark truncate text-xl font-bold">{task.name}</h3>
          <MoreButton
            ref={moreButtonRef}
            onClick={() => setShowEditTaskSmallMenu(true)}
          />
        </div>
        <div className="space-y-4">
          <h4 className="text-light text-sm font-bold">
            {allSubtasks < 1
              ? "No subtasks"
              : `Subtasks ( ${completedSubtasks} of ${allSubtasks} )`}
          </h4>

          <ul className="space-y-2">
            {task.subtasks
              .sort((a, b) => a.index - b.index)
              .map((subtask) => (
                <li
                  key={subtask.index}
                  className="bg-dark flex items-center gap-3 p-3 text-sm font-bold"
                >
                  <ToggleSubtaskForm
                    columnId={columnId}
                    taskId={task.id}
                    subtask={subtask}
                  />

                  <span
                    className={`${
                      subtask.completed
                        ? "text-secondary line-through"
                        : "text-dark"
                    } `}
                  >
                    {subtask.name}
                  </span>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h4 className="text-dark text-sm font-bold">Current status</h4>
          <div className="h-4" />
          <select
            disabled={pending || loading}
            onChange={(e) => setNewColumnId(e.target.value)}
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
            onChange={(e) => setNewTaskIndex(parseInt(e.target.value))}
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
          <Button onClick={handleColumnChange}>Save changes</Button>
          <Button variant="danger" onClick={handleClickOutside}>
            Close
          </Button>
        </div>
      </ModalWithBackdrop>
    </>
  );
};

export default EditTaskWindow;
