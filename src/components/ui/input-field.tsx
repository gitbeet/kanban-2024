import { forwardRef, type InputHTMLAttributes } from "react";
import { handlePressEnterToSubmit } from "~/utilities/handlePressEnterOrEscape";
import { motion } from "framer-motion";
import { smallElementTransition } from "~/utilities/framer-motion";
import ErrorText from "./error-text";
import Text from "./typography/text";

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
      <Text variant="primary">
        <label className="absolute -top-1 -translate-y-full" htmlFor={props.id}>
          {labelText}dsf
        </label>
      </Text>
    );

    // ***** ERROR ELEMENTS *****
    //  error element that is not position absolute and affects the layout when error is popped
    const shiftLayoutError = (
      <motion.div
        layout="position"
        initial={false}
        animate={{
          opacity: error?.length !== 0 ? 1 : 0,
          y: error?.length !== 0 ? 2 : "-50%",
        }}
        transition={smallElementTransition}
      >
        {error?.length !== 0 && (
          <>
            <div className="h-1" />
            <ErrorText message={error} className="justify-end" />
          </>
        )}
      </motion.div>
    );
    // error elements that do not affect the layout
    const topError = (
      <motion.div
        layout="position"
        initial={{ opacity: 0, top: "0px", y: "-100%" }}
        animate={{
          opacity: 1,
          top: "-4px",
          y: "-100%",
        }}
        transition={smallElementTransition}
        className={` ${errorPlacement === "topLeft" ? "text-left" : "text-right"} absolute w-full`}
      >
        {error?.length !== 0 && (
          <ErrorText
            message={error}
            className={
              errorPlacement === "topLeft" ? "justify-start" : "justify-end"
            }
          />
        )}
      </motion.div>
    );

    const bottomError = (
      <motion.div
        layout="position"
        initial={{ opacity: 0, bottom: "0px", y: "100%" }}
        animate={{
          opacity: 1,
          bottom: "-4px",
          y: "100%",
        }}
        transition={smallElementTransition}
        className="absolute w-full"
      >
        {error?.length !== 0 && (
          <ErrorText
            message={error}
            className={
              errorPlacement === "bottomLeft" ? "justify-start" : "justify-end"
            }
          />
        )}
      </motion.div>
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
