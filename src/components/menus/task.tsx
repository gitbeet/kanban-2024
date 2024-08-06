"use client";

import React, { useState } from "react";
import useHasMounted from "~/hooks/useHasMounted";
import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";
import { createPortal } from "react-dom";
import ToggleSubtaskForm from "../action-forms/subtask/toggle-subtask-form";
import DeleteTaskForm from "../action-forms/task/delete-task-form";
import { Button, CancelButton, CloseButton } from "../ui/buttons";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { TaskType } from "~/types";
import { EditTaskWindow } from "./edit-task";
import { ModalWithBackdrop } from "../ui/modal";

const EditTask = ({ columnId, task }: { columnId: string; task: TaskType }) => {
  const { showEditTaskMenu, setEditedTask, setShowEditTaskMenu } = useUI();
  const [showEditTaskWindow, setShowEditTaskWindow] = useState(false);
  const [showConfirmDeleteWindow, setShowConfirmDeleteWindow] = useState(false);
  const [showSmallMenu, setShowSmallMenu] = useState(false);
  const { getCurrentBoard } = useBoards();

  // for the createPortal
  const hasMounted = useHasMounted();
  const columns = getCurrentBoard()?.columns;

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

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const allSubtasks = task.subtasks.length;

  const jsx = (
    <>
      {/* Main menu */}
      <ModalWithBackdrop
        zIndex={20}
        show={showEditTaskMenu}
        showBackdrop={showEditTaskMenu && !showSmallMenu && !showEditTaskWindow}
        onClose={handleClickOutsideMenu}
        className={`absolute left-[50dvw] top-[50dvh] flex min-w-80 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 p-6`}
      >
        <div>
          <div className="flex justify-between">
            <h3>{task.name}</h3>{" "}
            <BsThreeDotsVertical
              onClick={() => setShowSmallMenu(true)}
              className="h-6 w-6 shrink-0 cursor-pointer"
            />
          </div>
        </div>
        <h4>
          Subtasks ({completedSubtasks} of {allSubtasks})
        </h4>

        <ul>
          {task.subtasks
            .sort((a, b) => a.index - b.index)
            .map((subtask) => (
              <li key={subtask.index} className="flex items-center gap-4 py-1">
                <ToggleSubtaskForm
                  columnId={columnId}
                  taskId={task.id}
                  subtask={subtask}
                />

                <span
                  className={
                    subtask.completed ? "text-secondary line-through" : ""
                  }
                >
                  {subtask.name}
                </span>
              </li>
            ))}
        </ul>
        <div>
          <p>Current status</p>
          <div className="h-4" />
          <select className="w-full bg-neutral-850 px-1 py-2 text-white">
            {columns?.map((c) => <option key={c.id}>{c.name}</option>)}
          </select>
        </div>
      </ModalWithBackdrop>
      {/* Small menu (edit and delete) */}
      <ModalWithBackdrop
        zIndex={30}
        show={showSmallMenu}
        showBackdrop={showSmallMenu && showEditTaskMenu && !showEditTaskWindow}
        onClose={handleClickOutsideSmallMenu}
        className="absolute left-[50dvw] top-[50dvh] -translate-y-full translate-x-full p-4"
      >
        <div className="flex w-max flex-col gap-2">
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
        </div>
      </ModalWithBackdrop>
      {/* Delete confirmation window */}
      <ModalWithBackdrop
        className="absolute left-[50dvw] top-[50dvh] w-max -translate-x-1/2 -translate-y-1/2 p-4"
        showBackdrop={showConfirmDeleteWindow}
        zIndex={50}
        onClose={() => setShowConfirmDeleteWindow(false)}
        show={showConfirmDeleteWindow}
      >
        <div className="relative h-full w-full">
          <CloseButton
            onClick={() => setShowConfirmDeleteWindow(false)}
            className="relative left-full -translate-x-full"
          />
          <div className="h-4" />
          <div className="flex flex-col items-center gap-8">
            <h3>Are you sure you want to delete this task?</h3>
            <div className="flex items-center gap-2">
              <DeleteTaskForm columnId={columnId} taskId={task.id}>
                <Button type="submit" variant="danger">
                  Delete
                </Button>
              </DeleteTaskForm>
              <Button
                onClick={() => setShowConfirmDeleteWindow(false)}
                type="submit"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </ModalWithBackdrop>
      {/* Edit task menu */}
      <ModalWithBackdrop
        zIndex={40}
        show={showEditTaskWindow}
        showBackdrop={showSmallMenu && showEditTaskMenu && showEditTaskWindow}
        onClose={handleClickOutsideEditWindow}
        className={`left-[50dvw] top-[50dvh] min-w-64 -translate-x-1/2 -translate-y-1/2 space-y-4 p-6`}
      >
        <EditTaskWindow
          columnId={columnId}
          task={task}
          show={showEditTaskWindow}
          onClose={handleClickOutsideEditWindow}
        />
      </ModalWithBackdrop>
    </>
  );

  return hasMounted
    ? createPortal(jsx, document.getElementById("modal-root")!)
    : null;
};

export default EditTask;
