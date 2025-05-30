import { ModalWithBackdropAndPosition } from "~/components/ui/modal/modal";
import type { ModalWithBackdropAndPositionProps } from "~/components/ui/modal/modal";

const MoreButtonMenu = ({
  position,
  onClose,
  show,
  showBackdrop,
  zIndex,
  align,
  ...props
}: ModalWithBackdropAndPositionProps) => {
  return (
    <ModalWithBackdropAndPosition
      align={align}
      position={position}
      centered={false}
      zIndex={zIndex}
      show={show}
      showBackdrop={showBackdrop}
      onClose={onClose}
      className="!w-fit !p-4"
      {...props}
    >
      <div className="flex w-max flex-col gap-2">{props.children}</div>
    </ModalWithBackdropAndPosition>
  );
};

export default MoreButtonMenu;
