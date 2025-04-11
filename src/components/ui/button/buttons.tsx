"use client";

import { useFormStatus } from "react-dom";
import { FaCheck, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { MdClose, MdEdit } from "react-icons/md";
import { LoadingPage } from "../loading-spinner";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";

export type ButtonVariant =
  | "primary"
  | "ghost"
  | "text"
  | "danger"
  | "secondary";
export type ButtonSize = "small" | "base";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "text" | "danger" | "secondary";
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
  const variantClasses = `${variant === "secondary" ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-neutral-50 hover:text-white" : variant === "primary" ? "bg-neutral-900 hover:bg-neutral-700 dark:bg-neutral-50 dark:hover:bg-white text-neutral-50 dark:text-neutral-800 dark:hover:text-neutral-900 hover:text-white" : variant === "ghost" ? "border border-neutral-350 bg-transparent text-neutral-850 hover:text-neutral-950 hover:border-neutral-650 dark:border-neutral-650 dark:text-neutral-50 dark:hover:border-neutral-500" : variant === "danger" ? "bg-danger-400 text-white  hover:bg-danger-300" : ""} ${size === "small" ? "text-sm" : ""} transition ${variant !== "text" ? "shadow" : ""} `;

  return (
    <button
      {...props}
      className={` ${props.className} ${variantClasses} rounded px-3 py-1.5 font-bold active:opacity-50 ${loading ? "cursor-wait" : ""} disabled:opacity-50`}
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
        className={`transition-colors--default flex h-6 w-6 shrink-0 items-center justify-center text-neutral-700 dark:text-neutral-250 ${variantColor} disabled:pointer-events-none disabled:opacity-50 ${props.className}`}
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
    <FaPlus className="h-4.5 w-4.5 shrink-0 rotate-45" />
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

type ToggleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  checked: boolean;
  size?: "small" | "base";
};

export const ToggleButton = ({
  checked,
  size = "base",
  ...props
}: ToggleButtonProps) => {
  const containerSizeClass = size === "small" ? "h-4 w-4" : "h-5 w-5";
  const iconSizeClass = size === "small" ? "h-2.5 w-2.5" : "h-3 w-3";
  return (
    <button
      type="submit"
      className={`flex ${containerSizeClass} shrink-0 items-center justify-center rounded-full shadow ${checked ? "bg-success-400" : "border border-neutral-350 bg-neutral-250 dark:border-neutral-500 dark:bg-neutral-800"} `}
      {...props}
    >
      {checked ? (
        <FaCheck
          className={` ${iconSizeClass} shrink-0 text-white dark:text-neutral-750`}
        />
      ) : undefined}
    </button>
  );
};
