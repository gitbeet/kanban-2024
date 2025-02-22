"use client";

import React, { useTransition, useState, useRef } from "react";
import type { ChangeEvent } from "react";
import useHasMounted from "~/hooks/useHasMounted";
import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";
import ToggleSubtaskForm from "../../action-forms/subtask/toggle-subtask-form";
import DeleteTaskForm from "../../action-forms/task/delete-task-form";
import { Button, MoreButton } from "../../ui/button/buttons";
import type { TaskType } from "~/types";
import { EditTaskMenu } from "./edit-task-menu";
import { ModalWithBackdrop } from "../../ui/modal/modal";
import { handleSwitchTaskColumn } from "~/server/queries";
import PromptWindow from "~/components/ui/modal/prompt-window";
import MoreButtonMenu from "~/components/ui/modal/more-button-menu";

const TaskMenu = ({ columnId, task }: { columnId: string; task: TaskType }) => {
  const { setOptimisticBoards } = useBoards();
  const { showEditTaskMenu, setEditedTask, setShowEditTaskMenu } = useUI();

  const [showEditTaskWindow, setShowEditTaskWindow] = useState(false);
  const [showConfirmDeleteWindow, setShowConfirmDeleteWindow] = useState(false);
  const [showSmallMenu, setShowSmallMenu] = useState(false);

  const { getCurrentBoard } = useBoards();

  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const [currentColumnId, setCurrentColumnId] = useState(columnId);

  // for the createPortal
  const hasMounted = useHasMounted();
  const board = getCurrentBoard();

  const handleColumnChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setLoading(true);
    setCurrentColumnId(e.target.value);
    const newColumnIndex =
      (board?.columns.find((col) => col.id === e.target.value)?.tasks.length ??
        0) + 1;

    setEditedTask((prev) => ({ ...prev, columnId: e.target.value }));

    startTransition(() => {
      setOptimisticBoards({
        action: "switchTaskColumn",
        boardId: board?.id,
        taskId: task.id,
        oldColumnId: columnId,
        newColumnId: e.target.value,
        oldColumnIndex: task.index,
        newColumnIndex,
      });
    });

    const response = await handleSwitchTaskColumn({
      change: {
        action: "switchTaskColumn",
        taskId: task.id,
        oldColumnId: columnId,
        newColumnId: e.target.value,
        oldColumnIndex: task.index,
        newColumnIndex,
      },
      revalidate: true,
    });

    if (response?.error) {
      console.log(response.error);
      return setLoading(false);
    }
    setLoading(false);
  };

  // for the big menu
  function handleClickOutsideMenu() {
    if (showEditTaskWindow || showSmallMenu) return;
    setEditedTask({ columnId: null, taskId: null });
    setShowEditTaskMenu(false);
  }

  // for the small menu
  function handleClickOutsideSmallMenu() {
    if (showEditTaskWindow) return;
    setShowSmallMenu(false);
  }
  // for the edit window
  function handleClickOutsideEditWindow() {
    setShowEditTaskWindow(false);
  }

  function handleShowEditTaskWindow() {
    setShowEditTaskWindow(true);
  }

  function handleClickOutsideConfirmDeleteWindow() {
    setShowConfirmDeleteWindow(false);
  }

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const allSubtasks = task.subtasks.length;

  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const mainMenuJSX = (
    <ModalWithBackdrop
      zIndex={20}
      show={showEditTaskMenu}
      showBackdrop={showEditTaskMenu && !showSmallMenu && !showEditTaskWindow}
      onClose={handleClickOutsideMenu}
      className="flex flex-col gap-8"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-dark truncate text-xl font-bold">{task.name}</h3>
        <MoreButton
          ref={moreButtonRef}
          onClick={() => setShowSmallMenu(true)}
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
          onChange={(e) => handleColumnChange(e)}
          value={currentColumnId}
        >
          {board?.columns?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <Button onClick={handleClickOutsideMenu}>Close</Button>
    </ModalWithBackdrop>
  );
  const moreButtonMenuJSX = (
    <MoreButtonMenu
      position={{
        x: moreButtonRef.current?.getBoundingClientRect().left ?? 0,
        y: moreButtonRef.current?.getBoundingClientRect().top ?? 0,
      }}
      centered={false}
      zIndex={30}
      show={showSmallMenu}
      showBackdrop={
        showSmallMenu &&
        showEditTaskMenu &&
        !showEditTaskWindow &&
        !showConfirmDeleteWindow
      }
      onClose={handleClickOutsideSmallMenu}
      className="!w-fit !p-4"
    >
      <>
        <Button
          type="button"
          variant="ghost"
          onClick={handleShowEditTaskWindow}
        >
          Edit task
        </Button>
        <Button
          onClick={() => setShowConfirmDeleteWindow(true)}
          variant="danger"
        >
          Delete task
        </Button>
      </>
    </MoreButtonMenu>
  );
  const confirmDeleteTaskMenuJSX = (
    <>
      <PromptWindow
        zIndex={40}
        showBackdrop={
          showConfirmDeleteWindow && showEditTaskMenu && showSmallMenu
        }
        show={showConfirmDeleteWindow}
        onClose={handleClickOutsideConfirmDeleteWindow}
        message={
          <span>
            Are you sure you want to delete the ‘
            <span className="font-bold">{task.name}</span>’ task and its
            subtasks? This action cannot be reversed.
          </span>
        }
        confirmButton={
          <DeleteTaskForm columnId={columnId} taskId={task.id}>
            <Button type="submit" variant="danger">
              Delete Task
            </Button>
          </DeleteTaskForm>
        }
        cancelButton={
          <Button
            onClick={handleClickOutsideConfirmDeleteWindow}
            variant="ghost"
          >
            Cancel
          </Button>
        }
      />
    </>
  );
  const editTaskWindowJSX = (
    <EditTaskMenu
      columnId={columnId}
      task={task}
      show={showEditTaskWindow}
      zIndex={40}
      showBackdrop={showSmallMenu && showEditTaskMenu && showEditTaskWindow}
      onClose={handleClickOutsideEditWindow}
    />
  );
  return (
    <>
      {mainMenuJSX}
      {moreButtonMenuJSX}
      {confirmDeleteTaskMenuJSX}
      {editTaskWindowJSX}
    </>
  );
};

export default TaskMenu;
