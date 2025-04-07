import { createPortal } from "react-dom";
import useHasMounted from "~/hooks/useHasMounted";
import { AnimatePresence, motion, type MotionProps } from "framer-motion";
type BackdropProps = MotionProps & {
  show: boolean;
  className?: string;
  onClose?: () => void;
};

const Backdrop = ({ show, onClose, className, ...props }: BackdropProps) => {
  const mounted = useHasMounted();
  const jsx = (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          {...props}
          className={`absolute inset-0 h-screen w-screen bg-[rgb(0,0,0)]/20 ${className} backdrop-blur-sm`}
        />
      )}
    </AnimatePresence>
  );
  return mounted
    ? createPortal(jsx, document.getElementById("modal-root") as Element)
    : null;
};

export default Backdrop;
