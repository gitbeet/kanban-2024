import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { handlePressEnterToSubmit } from "~/utilities/handlePressEnterOrEscape";
import { motion, MotionProps } from "framer-motion";
import { smallElementTransition } from "~/utilities/framer-motion";

type TextAreaProps = MotionProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    className?: string;
    error?: string;
    handleSubmit?: () => void | Promise<void>;
    handleCancel?: () => void;
  };

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, className, handleCancel, handleSubmit, ...props }, ref) => {
    return (
      <motion.div layout="position" className="relative">
        <textarea
          ref={ref}
          className={`${className} ${error ? "!focus:outline-danger-400 !text-danger-400 !outline !outline-danger-400 !ring !ring-danger-400" : ""} w-full resize-none overflow-hidden`}
          onKeyDown={(e) =>
            handleCancel && handleSubmit
              ? handlePressEnterToSubmit(e, handleSubmit, handleCancel)
              : undefined
          }
          {...props}
        />
        <motion.p
          initial={false}
          animate={{ opacity: error ? 1 : 0.5, y: error ? 2 : "-50%" }}
          transition={smallElementTransition}
          className="w-full truncate text-right text-sm text-danger-400"
        >
          {error}
        </motion.p>
      </motion.div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
