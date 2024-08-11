import { KeyboardEvent, useRef, type InputHTMLAttributes } from "react";
import { handlePressEnterToSubmit } from "~/utilities/handlePressEnterToSubmit";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error: string;
  labelText?: string;
  errorPlacement?: "top" | "bottom";
  handleSubmit?: () => void | Promise<void>;
  handleCancel?: () => void;
}

const InputField = ({
  className,
  error,
  labelText,
  errorPlacement = "top",
  handleSubmit,
  handleCancel,
  ...props
}: InputProps) => {
  const inputField = (
    <input
      {...props}
      onKeyDown={(e) =>
        handleCancel && handleSubmit
          ? handlePressEnterToSubmit(e, handleSubmit, handleCancel)
          : undefined
      }
      className={`${className} ${props.readOnly ? "input-readonly" : "input"} ${error ? "!border-danger-400 !text-danger-400" : "border-neutral-500"}`}
    />
  );

  const errorJSX = <p className="text-sm text-danger-400">{error}</p>;

  return (
    <div className="relative w-full">
      {errorPlacement === "top" && (
        <>
          <div className="flex h-5 justify-between text-sm">
            {labelText && <label htmlFor={props.id}>{labelText}</label>}
            {error && errorJSX}
          </div>
          <div className="h-1" />
          {inputField}
          <div className="h-6" />
        </>
      )}
      {errorPlacement === "bottom" && (
        <>
          {inputField}
          <div className="h-1" />

          <div className="h-5 text-right text-sm">{error && errorJSX}</div>
        </>
      )}
    </div>
  );
};

export default InputField;
