"use client";

import React, { useState } from "react";
import useHasMounted from "~/hooks/useHasMounted";
import useClickOutside from "~/hooks/useClickOutside";
import { useUI } from "~/context/ui-context";
import { useBoards } from "~/context/boards-context";
import { createPortal } from "react-dom";
import ToggleSubtaskForm from "../action-forms/subtask/toggle-subtask-form";
import DeleteTaskForm from "../action-forms/task/delete-task-form";
import { Button } from "../ui/buttons";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { TaskType } from "~/types";
import { SmallMenu } from "./SmallMenu";
import { EditTaskWindow } from "./edit-task";

const EditTask = ({ columnId, task }: { columnId: string; task: TaskType }) => {
  const { showEditTaskMenu, setEditedTask, setShowEditTaskMenu } = useUI();
  const [showEditTaskWindow, setShowEditTaskWindow] = useState(false);
  const [showSmallMenu, setShowSmallMenu] = useState(false);
  const { getCurrentBoard } = useBoards();

  // useClickOutside to close the small menu and backdrop onclick to close the big menu
  const { ref: smallMenuRef } = useClickOutside<HTMLDivElement>(
    handleClickOutsideSmallMenu,
  );

  const { ref: menuRef } = useClickOutside<HTMLDivElement>(
    handleClickOutsideMenu,
  );

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
      <div
        ref={menuRef}
        className={`absolute left-[50dvw] top-[50dvh] z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-4 border bg-neutral-600 p-4 ${showEditTaskMenu ? "opacity-100" : "pointer-events-none opacity-0"} min-w-56`}
      >
        <div className="">
          <div className="flex justify-between">
            <h3>{task.name}</h3>{" "}
            <BsThreeDotsVertical
              onClick={() => setShowSmallMenu(true)}
              className="h-6 w-6 shrink-0 cursor-pointer"
            />
            {showSmallMenu && (
              <>
                <SmallMenu
                  ref={smallMenuRef}
                  className="absolute left-full top-0 z-30"
                >
                  <div className="flex w-max flex-col gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleShowEditTaskWindow}
                    >
                      Edit task
                    </Button>
                    <DeleteTaskForm columnId={columnId} taskId={task.id}>
                      <Button type="submit" variant="danger">
                        Delete task
                      </Button>
                    </DeleteTaskForm>
                  </div>
                  <EditTaskWindow
                    columnId={columnId}
                    task={task}
                    show={showEditTaskWindow}
                    onClose={handleClickOutsideEditWindow}
                  />
                </SmallMenu>
              </>
            )}
          </div>
        </div>
        <h4>
          Subtasks ({completedSubtasks} of {allSubtasks})
        </h4>

        <ul className="border p-2">
          {task.subtasks
            .sort((a, b) => a.index - b.index)
            .map((subtask) => (
              <li key={subtask.index} className="flex justify-between py-1">
                <span className={subtask.completed ? "line-through" : ""}>
                  {subtask.name}
                </span>

                <ToggleSubtaskForm
                  columnId={columnId}
                  taskId={task.id}
                  subtask={subtask}
                />
              </li>
            ))}
        </ul>
        <div>
          <p>Move to : </p>
          <select className="bg-neutral-850 p-1 text-white">
            {columns?.map((c) => <option key={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      {/* <Backdrop
        onClick={handleClickOutsideMenu}
        className={`z-10 ${showSmallMenu ? "pointer-events-none" : ""}`}
      /> */}
    </>
  );

  return hasMounted
    ? createPortal(jsx, document.getElementById("modal-root")!)
    : null;
};

export default EditTask;
