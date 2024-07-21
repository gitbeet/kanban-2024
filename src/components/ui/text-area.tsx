import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <>
        <textarea
          rows={1}
          ref={ref}
          className={`${className} ${error ? "!border-red-500" : ""} w-full resize-none overflow-hidden`}
          {...props}
        />
        {error && <p className="text-right text-sm text-red-500">{error}</p>}
      </>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
