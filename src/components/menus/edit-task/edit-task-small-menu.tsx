import { SmartPortalWithBackdrop } from "~/components/common/smart-portal";
import { Button } from "~/components/ui/button/button";
import { useUI } from "~/context/ui-context";

const EditTaskSmallMenu = ({
  buttonLeft,
  buttonBottom,
  buttonWidth,
}: {
  buttonLeft: number;
  buttonBottom: number;
  buttonWidth: number;
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
    <SmartPortalWithBackdrop
      zIndex={30}
      buttonLeft={buttonLeft}
      buttonBottom={buttonBottom}
      buttonWidth={buttonWidth}
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
    >
      <div className="flex w-max flex-col gap-2">
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
      </div>
    </SmartPortalWithBackdrop>
  );
};

export default EditTaskSmallMenu;
