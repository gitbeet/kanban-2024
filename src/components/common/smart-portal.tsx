import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useHasMounted from "~/hooks/useHasMounted";
import FocusTrap from "focus-trap-react";
import { AnimatePresence, motion } from "framer-motion";
import { modalTransition } from "~/utilities/framer-motion";
import Backdrop from "../ui/modal/backdrop";
type Alignment = "left" | "center" | "right";

type SmartPortalProps = {
  show: boolean;
  onClose: () => void;
  zIndex: number;
  align?: Alignment;
  children?: React.ReactNode;
  buttonLeft: number | undefined;
  buttonWidth: number | undefined;
  buttonBottom: number | undefined;
};

export const SmartPortal = ({
  show,
  onClose,
  zIndex,
  align = "center",
  children,
  buttonLeft,
  buttonWidth,
  buttonBottom,
}: SmartPortalProps) => {
  const mounted = useHasMounted();
  const menuRef = useRef<HTMLDivElement>(null);
  const [positionStyle, setPositionStyle] = useState({
    left: "0px",
    top: "0px",
  });

  const calculatePosition = useCallback(() => {
    if (!menuRef.current || !buttonBottom || !buttonWidth || !buttonLeft)
      return;

    const menuWidth = menuRef.current.offsetWidth;
    let leftPosition: number;

    // Calculate based on alignment preference
    switch (align) {
      case "left":
        leftPosition = buttonLeft;
        break;
      case "right":
        leftPosition = buttonLeft + buttonWidth - menuWidth;
        break;
      case "center":
      default:
        leftPosition = buttonLeft + buttonWidth / 2 - menuWidth / 2;
    }

    // Boundary checks with 8px margin
    const rightOverflow = leftPosition + menuWidth - window.innerWidth;
    if (rightOverflow > 0) leftPosition -= rightOverflow + 8;
    if (leftPosition < 8) leftPosition = 8;

    setPositionStyle({
      left: `${leftPosition}px`,
      top: `${buttonBottom + window.scrollY + 4}px`, // 4px gap from button
    });
  }, [buttonBottom, buttonLeft, buttonWidth, align]);

  useEffect(() => {
    if (show) {
      calculatePosition();
      const handleResize = () => calculatePosition();
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", calculatePosition, true);
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", calculatePosition, true);
      };
    } else {
      // Reset position when closing
      setPositionStyle((prev) => ({ ...prev }));
    }
  }, [show, calculatePosition]);

  useEffect(() => {
    if (menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
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

  const jsx = (
    <FocusTrap
      active={show}
      focusTrapOptions={{
        allowOutsideClick: true,
        escapeDeactivates: true,
        clickOutsideDeactivates: true,
        onDeactivate: onClose,
        checkCanFocusTrap: () => new Promise((r) => setTimeout(r, 0)),
      }}
    >
      <motion.div
        initial={false}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.85 }}
        transition={modalTransition}
        ref={menuRef}
        style={{ ...positionStyle, zIndex }}
        className={`menu-bg absolute p-4 ${show ? "" : "pointer-events-none"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </FocusTrap>
  );

  return mounted
    ? createPortal(jsx, document.getElementById("modal-root") as Element)
    : null;
};

type SmartPortalWithBackdropProps = SmartPortalProps & {
  showBackdrop: boolean;
};

export const SmartPortalWithBackdrop = ({
  showBackdrop,
  ...props
}: SmartPortalWithBackdropProps) => {
  return (
    <>
      <SmartPortal {...props} />
      <Backdrop show={showBackdrop} style={{ zIndex: props.zIndex - 5 }} />
    </>
  );
};
