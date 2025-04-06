import { SmartPortalWithBackdrop } from "~/components/common/smart-portal";
import { Button } from "~/components/ui/button/buttons";
import { useUI } from "~/context/ui-context";
type Props = { buttonBottom: number; buttonLeft: number; buttonWidth: number };

const EditBoardSmallMenu = ({
  buttonBottom,
  buttonLeft,
  buttonWidth,
}: Props) => {
  const {
    showEditBoardWindow,
    showConfirmDeleteBoardWindow,
    setShowEditBoardWindow,
    setShowEditBoardMenu,
    setShowConfirmDeleteBoardWindow,
  } = useUI();
  return (
    <SmartPortalWithBackdrop
      buttonBottom={buttonBottom}
      buttonLeft={buttonLeft}
      buttonWidth={buttonWidth}
      show={showEditBoardWindow}
      showBackdrop={showEditBoardWindow && !showConfirmDeleteBoardWindow}
      onClose={() => setShowEditBoardWindow(false)}
      zIndex={40}
      align="left"
    >
      <div className="flex w-max flex-col gap-2">
        <Button onClick={() => setShowEditBoardMenu(true)} variant="ghost">
          Edit Board
        </Button>
        <Button
          onClick={() => setShowConfirmDeleteBoardWindow(true)}
          variant="danger"
        >
          Delete Board
        </Button>
      </div>
    </SmartPortalWithBackdrop>
  );
};

export default EditBoardSmallMenu;
