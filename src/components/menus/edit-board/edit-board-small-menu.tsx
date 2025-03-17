import React from "react";
import { Button } from "~/components/ui/button/buttons";
import MoreButtonMenu from "~/components/ui/modal/more-button-menu";
import { useUI } from "~/context/ui-context";

const EditBoardSmallMenu = ({
  position,
}: {
  position: { x: number; y: number };
}) => {
  const {
    showEditBoardWindow,
    showConfirmDeleteBoardWindow,
    setShowEditBoardWindow,
    setShowEditBoardMenu,
    setShowConfirmDeleteBoardWindow,
  } = useUI();
  return (
    <MoreButtonMenu
      position={{
        x: position.x ?? 0,
        y: position.y ?? 0,
      }}
      show={showEditBoardWindow}
      showBackdrop={showEditBoardWindow && !showConfirmDeleteBoardWindow}
      onClose={() => setShowEditBoardWindow(false)}
      zIndex={40}
      align="right"
    >
      <Button onClick={() => setShowEditBoardMenu(true)} variant="ghost">
        Edit Board
      </Button>
      <Button
        onClick={() => setShowConfirmDeleteBoardWindow(true)}
        variant="danger"
      >
        Delete Board
      </Button>
    </MoreButtonMenu>
  );
};

export default EditBoardSmallMenu;
