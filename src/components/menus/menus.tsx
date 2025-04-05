"use client";

import EditTaskMenus from "./edit-task/edit-task-menus";
import ConfirmDeleteColumn from "./confirm-delete-column";
import EditBoardMenus from "./edit-board/edit-board-menus";

const Menus = () => {
  return (
    <>
      <EditTaskMenus />
      <EditBoardMenus />
      <ConfirmDeleteColumn />
    </>
  );
};

export default Menus;
