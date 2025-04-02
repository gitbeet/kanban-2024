import { forwardRef, type InputHTMLAttributes } from "react";
import { handlePressEnterToSubmit } from "~/utilities/handlePressEnterOrEscape";
import { motion } from "framer-motion";
import { smallElementTransition } from "~/utilities/framer-motion";

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
  shiftLayout: false;
  errorPlacement: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
};

type InputProps = BaseProps & (ShiftLayoutProps | NonShiftLayoutProps);

const InputField = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      error,
      labelText,
      errorPlacement,
      menu = false,
      handleSubmit,
      handleCancel,
      shiftLayout,
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

    // ***** ERROR ELEMENTS *****
    //  error element that is not position absolute and affects the layout when error is popped
    const shiftLayoutError = (
      <motion.div
        layout="position"
        initial={false}
        animate={{
          opacity: error?.length !== 0 ? 1 : 0.5,
          y: error?.length !== 0 ? 2 : "-50%",
        }}
        transition={smallElementTransition}
      >
        <div className="h-1" />
        <p className={`w-full truncate text-right text-sm text-danger-400`}>
          {error}
        </p>
      </motion.div>
    );
    // error elements that do not affect the layout
    const topError = (
      <motion.p
        layout="position"
        initial={{ opacity: 0, top: "0px", y: "-100%" }}
        animate={{
          opacity: 1,
          top: "-4px",
          y: "-100%",
        }}
        transition={smallElementTransition}
        className={` ${errorPlacement === "topLeft" ? "text-left" : "text-right"} absolute w-full truncate text-left text-sm text-danger-400`}
      >
        {error}
      </motion.p>
    );

    const bottomError = (
      <motion.p
        layout="position"
        initial={{ opacity: 0, bottom: "0px", y: "100%" }}
        animate={{
          opacity: 1,
          bottom: "-4px",
          y: "100%",
        }}
        transition={smallElementTransition}
        className={` ${errorPlacement === "bottomLeft" ? "text-left" : "text-right"} absolute w-full truncate text-right text-sm text-danger-400`}
      >
        {error}
      </motion.p>
    );

    const errorJSX = (
      <>
        {shiftLayout && shiftLayoutError}
        {!shiftLayout && error?.length !== 0 && (
          <>
            {(errorPlacement === "bottomLeft" ||
              errorPlacement === "bottomRight") &&
              bottomError}
            {(errorPlacement === "topLeft" || errorPlacement === "topRight") &&
              topError}
          </>
        )}
      </>
    );

    return (
      <motion.div className="relative w-full">
        {labelText && labelJSX}
        {inputFieldJSX}
        {errorJSX}
      </motion.div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
