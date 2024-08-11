"use client";

import { useFormStatus } from "react-dom";
import { FaCheck, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { MdEdit } from "react-icons/md";
import { LoadingPage } from "../loading-spinner";
import { IoClose } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ghost?: boolean;
  variant?: "primary" | "ghost" | "text" | "danger";
  loading?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  loading,
  ...props
}: ButtonProps) => {
  const variantClasses = `${variant === "primary" ? "border-transparent bg-neutral-100 hover:bg-white text-neutral-950 shadow-md" : variant === "ghost" ? "border-neutral-250 text-white hover:border-neutral-100" : variant === "text" ? "border-transparent" : variant === "danger" ? "bg-danger-400 text-white border-transparent hover:bg-danger-300" : ""} transition-colors--default`;

  return (
    <button
      disabled={loading}
      {...props}
      className={` ${props.className} ${variantClasses} rounded border px-2 py-1 text-sm font-bold disabled:cursor-wait disabled:opacity-50`}
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

const IconButton = ({
  children,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger" | "success";
}) => {
  const variantColor =
    variant === "primary"
      ? "hover:text-neutral-50"
      : variant === "danger"
        ? "hover:text-danger-300"
        : variant === "success"
          ? "hover:text-success-400"
          : "";
  return (
    <button
      {...props}
      className={`bg-neutral-600 transition-colors--default flex h-6 w-6 shrink-0 items-center justify-center text-neutral-250 ${variantColor} disabled:pointer-events-none disabled:opacity-50 ${props.className}`}
    >
      {children}
    </button>
  );
};

export const EditButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props} className={` ${props.className}`}>
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
  <button {...props}>
    <IoClose className="h-5 w-5 shrink-0" />
  </button>
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
    className="hover:bg-teal-500 h-6 w-6 shrink-0 rounded-full"
  >
    <BsThreeDotsVertical className="h-full w-full" />
  </button>
));

MoreButton.displayName = "MoreButton";

export const ToggleButton = ({ checked }: { checked: boolean }) => (
  <button
    type="submit"
    className="flex h-6 w-6 items-center justify-center bg-neutral-850"
  >
    {checked ? <FaCheck className="h-4 w-4 shrink-0" /> : undefined}
  </button>
);
