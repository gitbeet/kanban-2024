import CloseButton from "../button/close-button";
import Text from "../typography/text";
import { ModalWithBackdrop } from "./modal";
interface Props {
  show: boolean;
  showBackdrop: boolean;
  zIndex: number;
  onClose: () => void;
  message: string | JSX.Element;
  confirmButton: JSX.Element;
  cancelButton: JSX.Element;
}

const PromptWindow = ({
  show,
  showBackdrop,
  zIndex,
  onClose,
  message,
  confirmButton,
  cancelButton,
}: Props) => {
  return (
    <ModalWithBackdrop
      className="menu"
      show={show}
      showBackdrop={showBackdrop}
      zIndex={zIndex}
      onClose={onClose}
    >
      <div className="relative h-full w-full">
        <CloseButton
          onClick={onClose}
          className="relative left-full -translate-x-full"
        />
        <div className="h-4" />
        <div className="flex flex-col items-center gap-8">
          <Text variant="primary">
            <p className="text-center">{message}</p>
          </Text>
          <div className="flex items-center gap-2">
            {confirmButton}
            {cancelButton}
          </div>
        </div>
      </div>
    </ModalWithBackdrop>
  );
};
export default PromptWindow;
