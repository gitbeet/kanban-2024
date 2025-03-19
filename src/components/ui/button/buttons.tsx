"use client";

import { useFormStatus } from "react-dom";
import { FaCheck, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { ForwardedRef, forwardRef, type ButtonHTMLAttributes } from "react";
import { MdClose, MdEdit } from "react-icons/md";
import { LoadingPage } from "../loading-spinner";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "text" | "danger";
  loading?: boolean;
  size?: "small" | "base";
}

export const Button = ({
  children,
  variant = "primary",
  size = "base",
  loading,
  ...props
}: ButtonProps) => {
  const variantClasses = `${variant === "primary" ? "border-transparent bg-primary-700 hover:bg-primary-650 text-neutral-50 hover:text-white shadow-md" : variant === "ghost" ? "border-neutral-350 bg-transparent text-neutral-850 hover:text-neutral-950 hover:border-neutral-500 dark:border-neutral-650 dark:text-neutral-50 dark:hover:border-neutral-500" : variant === "text" ? "border-transparent" : variant === "danger" ? "bg-danger-400 text-white border-transparent hover:bg-danger-300" : ""} ${size === "small" ? "text-sm" : ""} transition-colors--default `;

  return (
    <button
      {...props}
      className={` ${props.className} ${variantClasses} rounded border px-3 py-1.5 font-bold ${loading ? "cursor-wait" : ""} disabled:opacity-50`}
    >
      {loading ? <LoadingPage /> : children}
    </button>
  );
};

export const SubmitButton = ({ children, ...props }: ButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button {...props} disabled={pending}>
      {children}
    </Button>
  );
};

// ---------- ICON BUTTONS ----------

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger" | "success";
  preset?: "close";
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, variant = "primary", preset, ...props }, ref) => {
    const variantColor =
      variant === "primary"
        ? "hover:text-neutral-850 dark:hover:text-neutral-50"
        : variant === "danger"
          ? "hover:text-danger-300 dark:hover:text-danger-300"
          : variant === "success"
            ? "hover:text-success-400 dark:hover:text-success-400"
            : "";
    return (
      <button
        ref={ref}
        {...props}
        className={`bg-neutral-600 transition-colors--default flex h-6 w-6 shrink-0 items-center justify-center text-neutral-700 dark:text-neutral-250 ${variantColor} disabled:pointer-events-none disabled:opacity-50 ${props.className}`}
      >
        {preset === "close" && <MdClose className="h-full w-full" />}
        {children}
      </button>
    );
  },
);
IconButton.displayName = "IconButton";

export const SettingsButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) => (
  <IconButton {...props}>
    <IoSettingsSharp className="h-full w-full" />
  </IconButton>
);
export const EditButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props}>
    <MdEdit className="h-full w-full" />
  </IconButton>
);

export const DeleteButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) => (
  <IconButton {...props} variant="danger">
    <FaTrash />
  </IconButton>
);

export const CancelButton = ({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props} variant="danger">
    <FaPlus className="rotate-45" />
  </IconButton>
);

export const CloseButton = ({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props}>
    <MdClose className="h-6 w-6 shrink-0" />
  </IconButton>
);

export const SaveButton = ({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props} variant="success">
    <FaCheck className="h-3.5 w-3.5 shrink-0" />
  </IconButton>
);

export const MoreButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ ...props }, ref) => (
  <button
    {...props}
    ref={ref}
    className="transition-colors--default h-6 w-6 shrink-0 rounded-full text-neutral-650 hover:text-neutral-850 dark:text-neutral-250 dark:hover:text-neutral-50"
  >
    <BsThreeDotsVertical className="h-full w-full" />
  </button>
));

MoreButton.displayName = "MoreButton";

export const ToggleButton = ({ checked }: { checked: boolean }) => (
  <button
    type="submit"
    className={`flex h-5 w-5 items-center justify-center rounded-sm ${checked ? "bg-primary-700" : "bg-neutral-250 dark:bg-neutral-750"} text-white`}
  >
    {checked ? <FaCheck className="h-3.5 w-3.5 shrink-0" /> : undefined}
  </button>
);
