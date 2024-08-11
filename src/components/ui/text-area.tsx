import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { handlePressEnterToSubmit } from "~/utilities/handlePressEnterToSubmit";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  error?: string;
  handleSubmit?: () => void | Promise<void>;
  handleCancel?: () => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, className, handleCancel, handleSubmit, ...props }, ref) => {
    return (
      <>
        <textarea
          ref={ref}
          className={`${className} ${error ? "!border-danger-400" : ""} w-full resize-none overflow-hidden`}
          onKeyDown={(e) =>
            handleCancel && handleSubmit
              ? handlePressEnterToSubmit(e, handleSubmit, handleCancel)
              : undefined
          }
          {...props}
        />
        {error && (
          <p className="pt-1 text-right text-sm text-danger-400">{error}</p>
        )}
      </>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
