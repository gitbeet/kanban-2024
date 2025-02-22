import { Button } from "~/components/ui/button/buttons";
import MoreButtonMenu from "~/components/ui/modal/more-button-menu";
import { useUI } from "~/context/ui-context";

const EditTaskSmallMenu = ({
  position,
}: {
  position: { x: number; y: number };
}) => {
  const {
    showEditTaskSmallMenu,
    showEditTaskMenu,
    showEditTaskWindow,
    showConfirmDeleteTaskWindow,
    setShowEditTaskSmallMenu,
    setShowEditTaskWindow,
    setShowConfirmDeleteTaskWindow,
  } = useUI();
  return (
    <MoreButtonMenu
      position={{
        x: position.x ?? 0,
        y: position.y ?? 0,
      }}
      centered={false}
      zIndex={30}
      show={showEditTaskSmallMenu}
      showBackdrop={
        showEditTaskSmallMenu &&
        showEditTaskMenu &&
        !showEditTaskWindow &&
        !showConfirmDeleteTaskWindow
      }
      onClose={() => {
        if (showEditTaskWindow) return;
        setShowEditTaskSmallMenu(false);
      }}
      className="!w-fit !p-4"
    >
      <>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowEditTaskWindow(true)}
        >
          Edit task
        </Button>
        <Button
          onClick={() => setShowConfirmDeleteTaskWindow(true)}
          variant="danger"
        >
          Delete task
        </Button>
      </>
    </MoreButtonMenu>
  );
};

export default EditTaskSmallMenu;
