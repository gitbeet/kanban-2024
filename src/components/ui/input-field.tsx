import { forwardRef, type InputHTMLAttributes } from "react";
import { handlePressEnterToSubmit } from "~/utilities/handlePressEnterOrEscape";

type BaseProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  error?: string;
  labelText?: string;
  menu?: boolean;
  handleSubmit?: () => void | Promise<void>;
  handleCancel?: () => void;
};

type ShiftLayoutProps = {
  shiftLayout: true;
  errorPlacement?: never;
};

type NonShiftLayoutProps = {
  shiftLayout?: false;
  errorPlacement?: "topRight" | "bottomLeft" | "bottomRight";
};

type InputProps = BaseProps & (ShiftLayoutProps | NonShiftLayoutProps);

const InputField = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      error,
      labelText,
      errorPlacement = "topRight",
      menu = false,
      handleSubmit,
      handleCancel,
      shiftLayout = false,
      ...props
    },
    ref,
  ) => {
    const inputFieldJSX = (
      <input
        ref={ref}
        {...props}
        onKeyDown={(e) =>
          handleCancel && handleSubmit
            ? handlePressEnterToSubmit(e, handleSubmit, handleCancel)
            : undefined
        }
        className={`${className} ${props.readOnly ? "input-readonly" : menu ? "input-menu" : "input"} ${error ? "!focus:outline-danger-400 !text-danger-400 !outline !outline-danger-400 !ring !ring-danger-400" : "border-neutral-500"}`}
      />
    );

    const labelJSX = (
      <label
        className="text-dark absolute -top-1 -translate-y-full"
        htmlFor={props.id}
      >
        {labelText}
      </label>
    );

    const errorPlacementClass =
      errorPlacement === "topRight"
        ? "-top-1 -translate-y-full text-right"
        : errorPlacement === "bottomRight"
          ? "-bottom-1 translate-y-full text-right"
          : "-bottom-1 translate-y-full text-left";

    const errorJSX = (
      <>
        {shiftLayout && (
          <>
            <div className="h-1" />
            <p className={`w-full truncate text-right text-sm text-danger-400`}>
              {error}
            </p>
          </>
        )}
        {!shiftLayout && (
          <p
            className={`absolute w-full truncate text-sm text-danger-400 ${errorPlacementClass}`}
          >
            {error}
          </p>
        )}
      </>
    );

    return (
      <div className="relative w-full">
        {labelText && labelJSX}
        {inputFieldJSX}
        {errorJSX}
      </div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
