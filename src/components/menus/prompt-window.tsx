import { ModalWithBackdrop } from "../ui/modal";
import { CloseButton } from "../ui/buttons";

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
      className="absolute left-[50dvw] top-[50dvh] w-[min(calc(100dvw-2rem),25rem)] -translate-x-1/2 -translate-y-1/2"
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
          <h3 className="text-center">{message}</h3>
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
