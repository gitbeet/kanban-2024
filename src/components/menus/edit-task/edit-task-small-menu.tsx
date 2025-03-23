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
    showEditTaskMenuAdvanced,
    showConfirmDeleteTaskWindow,
    setShowEditTaskSmallMenu,
    setShowEditTaskMenuAdvanced,
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
        !showEditTaskMenuAdvanced &&
        !showConfirmDeleteTaskWindow
      }
      onClose={() => {
        if (showEditTaskMenuAdvanced) return;
        setShowEditTaskSmallMenu(false);
      }}
      className="!w-fit !p-4"
    >
      <>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowEditTaskMenuAdvanced(true)}
        >
          Edit task
        </Button>
        <Button
          onClick={() => {
            setShowConfirmDeleteTaskWindow(true);
          }}
          variant="danger"
        >
          Delete task
        </Button>
      </>
    </MoreButtonMenu>
  );
};

export default EditTaskSmallMenu;
