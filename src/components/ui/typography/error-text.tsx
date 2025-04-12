import { RiErrorWarningLine } from "react-icons/ri";
import { motion } from "framer-motion";
import Text from "./text";

const ErrorText = ({
  message,
  className,
}: {
  message: string | undefined;
  className?: string | undefined;
}) => {
  return (
    <Text variant="danger">
      <motion.p
        layout
        className={`flex items-center gap-0.5 text-sm ${className}`}
      >
        <RiErrorWarningLine className="shrink-0" />
        <span className="truncate">{message}</span>
      </motion.p>
    </Text>
  );
};

export default ErrorText;
