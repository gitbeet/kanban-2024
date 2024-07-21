import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { useUI } from "~/context/ui-context";

const MenuButton = ({
  columnId,
  taskId,
}: {
  columnId: string;
  taskId: string;
}) => {
  const { setShowEditTaskMenu, setEditedTask } = useUI();

  const handleClick = () => {
    setShowEditTaskMenu(true);
    setEditedTask({ columnId, taskId });
  };

  return (
    <div onClick={handleClick} className="pr-2">
      <FaRegEdit className="h-5 w-5" />
    </div>
  );
};

export default MenuButton;
