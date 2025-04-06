import type { HTMLAttributes } from "react";
import { createPortal } from "react-dom";
import useHasMounted from "~/hooks/useHasMounted";

interface BackdropProps extends HTMLAttributes<HTMLDivElement> {
  show: boolean;
  onClose?: () => void;
}

const Backdrop = ({ show, onClose, ...props }: BackdropProps) => {
  const mounted = useHasMounted();
  const jsx = (
    <div
      onClick={onClose}
      {...props}
      className={` ${show ? "opacity-100" : "pointer-events-none opacity-0"} absolute inset-0 h-screen w-screen bg-[rgb(0,0,0)]/20 transition-opacity duration-150 ${props.className} backdrop-blur-sm`}
    />
  );
  return mounted
    ? createPortal(jsx, document.getElementById("modal-root") as Element)
    : null;
};

export default Backdrop;
