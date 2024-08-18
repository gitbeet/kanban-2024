import type { HTMLAttributes } from "react";

interface BackdropProps extends HTMLAttributes<HTMLDivElement> {
  show: boolean;
  onClose: () => void;
}

const Backdrop = ({ show, onClose, ...props }: BackdropProps) => {
  return (
    <div
      onClick={onClose}
      {...props}
      className={` ${show ? "opacity-100" : "pointer-events-none opacity-0"} absolute inset-0 h-screen w-screen bg-[rgb(0,0,0)]/20 ${props.className} backdrop-blur-sm transition-opacity duration-150`}
    />
  );
};

export default Backdrop;
