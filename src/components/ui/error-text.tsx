import { RiErrorWarningLine } from "react-icons/ri";
import { motion } from "framer-motion";

const ErrorText = ({
  message,
  className,
}: {
  message: string | undefined;
  className?: string | undefined;
}) => {
  return (
    <motion.p
      layout
      className={`flex items-center gap-0.5 text-sm text-danger-400 ${className}`}
    >
      <RiErrorWarningLine className="shrink-0" />
      <span className="truncate">{message}</span>
    </motion.p>
  );
};

export default ErrorText;
