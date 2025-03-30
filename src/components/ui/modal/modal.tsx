import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import Backdrop from "./backdrop";
import { createPortal } from "react-dom";
import useHasMounted from "~/hooks/useHasMounted";
import FocusTrap from "focus-trap-react";
import { AnimationControls, motion, MotionProps } from "framer-motion";
import { modalTransition } from "~/utilities/framer-motion";
interface ModalProps extends MotionProps {
  children: ReactNode;
  zIndex: number;
  show: boolean;
  onClose: () => void;
  centered?: boolean;
  className?: string;
}

export const Modal = ({
  children,
  zIndex,
  show,
  onClose,
  centered = true,
  className = "",
  ...props
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        "a, button, input, textarea, select, details, [tabindex]:not([tabindex='-1'])",
      );

      focusableElements.forEach((el) => {
        if (!show) {
          el.setAttribute("tabindex", "-1"); // Disable focus when hidden
        } else {
          el.removeAttribute("tabindex"); // Restore focus when visible
        }
      });
    }
  }, [show]);

  return (
    <FocusTrap
      active={show}
      focusTrapOptions={{
        allowOutsideClick: true,
        escapeDeactivates: true,
        clickOutsideDeactivates: true,
        onDeactivate: () => onClose(),
        checkCanFocusTrap: () =>
          new Promise((resolve) => setTimeout(resolve, 200)),
      }}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: show ? 1 : 0,
          scale: show ? 1 : 0.85,
          x: centered ? "-50%" : 0,
          y: centered ? "-50%" : 0,
        }}
        transition={modalTransition}
        ref={modalRef}
        {...props}
        style={{ zIndex, ...props.style }}
        className={`menu-bg ${centered ? "menu" : ""} absolute p-6 ${show ? "" : "pointer-events-none"} text-dark ${className}`}
      >
        {children}
      </motion.div>
    </FocusTrap>
  );
};

interface ModalWithBackdropProps extends ModalProps {
  showBackdrop: boolean;
}

export const ModalWithBackdrop = ({
  children,
  zIndex,
  showBackdrop,
  onClose,
  ...props
}: ModalWithBackdropProps) => {
  const hasMounted = useHasMounted();
  const jsx = (
    <>
      <Modal zIndex={zIndex} onClose={onClose} {...props}>
        {children}
      </Modal>
      <Backdrop
        show={showBackdrop}
        // onClose={onClose}
        style={{ zIndex: zIndex - 5 }}
      />
    </>
  );

  return hasMounted
    ? createPortal(jsx, document.getElementById("modal-root")!)
    : null;
};

export interface ModalWithBackdropAndPositionProps
  extends ModalWithBackdropProps {
  position: {
    x: number;
    y: number;
  };
  align?: "left" | "center" | "right";
}

export const ModalWithBackdropAndPosition = ({
  children,
  position,
  align = "left",
  ...props
}: ModalWithBackdropAndPositionProps) => {
  const transform = `translate(${align === "left" ? "-90%,0" : align === "right" ? "1rem,1rem" : "-50%,0"})`;
  return (
    <ModalWithBackdrop
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
