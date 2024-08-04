import type { HTMLAttributes } from "react";
import { createPortal } from "react-dom";
import useHasMounted from "~/hooks/useHasMounted";
const Backdrop = ({ ...props }: HTMLAttributes<HTMLDivElement>) => {
  const hasMounted = useHasMounted();

  const jsx = (
    <div
      {...props}
      className={`absolute inset-0 h-screen w-screen bg-black/30 ${props.className}`}
    />
  );
  return hasMounted
    ? createPortal(jsx, document.getElementById("modal-root")!)
    : null;
};

export default Backdrop;
