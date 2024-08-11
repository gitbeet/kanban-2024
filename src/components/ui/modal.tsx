import { useEffect, type HTMLAttributes, type ReactNode } from "react";
import Backdrop from "./backdrop";
import { createPortal } from "react-dom";
import useHasMounted from "~/hooks/useHasMounted";
import FocusTrap from "focus-trap-react";
interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  zIndex: number;
  show: boolean;
  onClose: () => void;
  centered?: boolean;
}

export const Modal = ({
  children,
  zIndex,
  show,
  onClose,
  centered = true,
  ...props
}: ModalProps) => {
  return (
    <FocusTrap
      active={show}
      focusTrapOptions={{ allowOutsideClick: true, escapeDeactivates: false }}
    >
      <div
        {...props}
        style={{ zIndex, ...props.style }}
        className={`menu-bg ${centered ? "menu" : ""} absolute p-6 transition-opacity duration-200 ${show ? "opacity-100" : "pointer-events-none opacity-0"} ${props.className}`}
      >
        {children}
      </div>
    </FocusTrap>
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
  centered = true,
  onClose,
  ...props
}: ModalWithBackdropProps) => {
  const hasMounted = useHasMounted();
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (!showBackdrop) return;
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [show, showBackdrop, onClose]);
  const jsx = (
    <>
      <Modal zIndex={zIndex} show={show} onClose={onClose} {...props}>
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

interface ModalWithBackdropAndPositionProps extends ModalWithBackdropProps {
  position: {
    x: number;
    y: number;
  };
  align?: "left" | "center" | "right";
}

export const ModalWithBackdropAndPosition = ({
  children,
  zIndex,
  show,
  showBackdrop,
  onClose,
  position,
  align = "left",
  ...props
}: ModalWithBackdropAndPositionProps) => {
  const transform = `translate(${align === "left" ? "-90%,0" : align === "right" ? "1rem,1rem" : "-50%,0"})`;
  return (
    <ModalWithBackdrop
      show={show}
      onClose={onClose}
      showBackdrop={showBackdrop}
      zIndex={zIndex}
      centered={false}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform,
      }}
      {...props}
    >
      {children}
    </ModalWithBackdrop>
  );
};
