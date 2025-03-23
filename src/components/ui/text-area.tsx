import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { handlePressEnterToSubmit } from "~/utilities/handlePressEnterOrEscape";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  error?: string;
  handleSubmit?: () => void | Promise<void>;
  handleCancel?: () => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, className, handleCancel, handleSubmit, ...props }, ref) => {
    return (
      <div className="relative">
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
        {error && (
          <p className="absolute -bottom-1 w-full translate-y-full truncate text-right text-sm text-danger-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
