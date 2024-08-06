import type { HTMLAttributes, ReactNode } from "react";
import Backdrop from "./backdrop";
import { createPortal } from "react-dom";
import useHasMounted from "~/hooks/useHasMounted";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  zIndex: number;
  show: boolean;
}

export const Modal = ({ children, zIndex, show, ...props }: ModalProps) => {
  return (
    <div
      {...props}
      style={{ zIndex }}
      className={`menu-bg absolute transition-opacity duration-200 ${show ? "opacity-100" : "pointer-events-none opacity-0"} ${props.className}`}
    >
      {children}
    </div>
  );
};

interface ModalWithBackdropProps extends ModalProps {
  showBackdrop: boolean;
  onClose: () => void;
}

export const ModalWithBackdrop = ({
  children,
  zIndex,
  show,
  showBackdrop,
  onClose,
  ...props
}: ModalWithBackdropProps) => {
  const hasMounted = useHasMounted();

  const jsx = (
    <>
      <Modal zIndex={zIndex} show={show} {...props}>
        {children}
      </Modal>
      <Backdrop
        show={showBackdrop}
        onClose={onClose}
        style={{ zIndex: zIndex - 5 }}
      />
    </>
  );

  return hasMounted
    ? createPortal(jsx, document.getElementById("modal-root")!)
    : null;
};
