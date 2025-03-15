import { type InputHTMLAttributes } from "react";
import { handlePressEnterToSubmit } from "~/utilities/handlePressEnterOrEscape";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error: string;
  labelText?: string;
  errorPlacement?: "top" | "bottom";
  handleSubmit?: () => void | Promise<void>;
  handleCancel?: () => void;
  shiftLayout?: boolean;
}

const InputField = ({
  className,
  error,
  labelText,
  errorPlacement = "top",
  handleSubmit,
  handleCancel,
  shiftLayout = false,
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
            {labelText && (
              <label className="text-dark" htmlFor={props.id}>
                {labelText}
              </label>
            )}
            {error && errorJSX}
          </div>
          <div className="h-1" />
          {inputField}
          <div className="h-6" />
        </>
      )}
      {errorPlacement === "bottom" && (
        <>
          {labelText && (
            <label className="text-dark text-sm" htmlFor={props.id}>
              {labelText}
            </label>
          )}
          <div className="h-1" />
          {inputField}
          <div className="h-1" />
          {shiftLayout && error && (
            <div className="h-5 text-right text-sm">{errorJSX}</div>
          )}

          {!shiftLayout && (
            <div className="h-5 text-right text-sm">{error && errorJSX}</div>
          )}
        </>
      )}
    </div>
  );
};

export default InputField;
