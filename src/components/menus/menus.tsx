"use client";

import EditTaskMenus from "./edit-task/edit-task-menus";
import ConfirmDeleteColumn from "./confirm-delete-column";
import EditBoardMenus from "./edit-board/edit-board-menus";
import MobileMenu from "./mobile-menu";

const Menus = () => {
  return (
    <>
      <EditTaskMenus />
      <EditBoardMenus />
      <ConfirmDeleteColumn />
      <MobileMenu />
    </>
  );
};

export default Menus;
