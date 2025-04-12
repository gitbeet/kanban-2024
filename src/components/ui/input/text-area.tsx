import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { handlePressEnterToSubmit } from "~/utilities/handlePressEnterOrEscape";
import { motion, type MotionProps } from "framer-motion";
import { smallElementTransition } from "~/utilities/framer-motion";
import ErrorText from "../typography/error-text";

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
        <motion.div
          initial={false}
          animate={{
            opacity: error?.length !== 0 ? 1 : 0,
            y: error?.length !== 0 ? 0 : "-50%",
          }}
          transition={smallElementTransition}
        >
          {error?.length !== 0 && (
            <ErrorText message={error} className="justify-end" />
          )}
        </motion.div>
      </motion.div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
