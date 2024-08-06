"use client";

import { useFormStatus } from "react-dom";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import type { ButtonHTMLAttributes } from "react";
import { MdEdit } from "react-icons/md";
import LoadingSpinner, { LoadingPage } from "./loading-spinner";

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
  const variantClasses = `${variant === "primary" ? "border-transparent bg-white text-neutral-950 shadow-md" : variant === "ghost" ? "border-neutral-300 text-white" : variant === "text" ? "border-transparent" : variant === "danger" ? "bg-danger-500 text-white border-transparent" : ""}`;

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

const IconButton = ({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) => (
  <button
    {...props}
    className={`0 bg-neutral-600 flex h-6 w-6 items-center justify-center text-white disabled:pointer-events-none disabled:opacity-50 ${className} transition-colors--default`}
  >
    {children}
  </button>
);

export const EditButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton
    {...props}
    className={` ${props.className} flex h-6 w-6 items-center justify-center`}
  >
    <MdEdit className="h-full w-full" />
  </IconButton>
);

export const DeleteButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) => (
  <IconButton {...props}>
    <FaTrash
      className={`h-4 w-4 shrink-0 !bg-transparent text-neutral-650 hover:text-danger-600`}
    />
  </IconButton>
);

export const CreateButton = () => (
  <IconButton className="hover:text-teal-400">
    <FaPlus className="h-4 w-4 shrink-0" />
  </IconButton>
);

export const CancelButton = ({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props} className="hover:bg-red-500 rounded-full">
    <FaPlus className="h-4.5 w-4.5 shrink-0 rotate-45" />
  </IconButton>
);

export const SaveButton = ({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props} className="hover:bg-teal-500 rounded-full">
    <FaCheck className="h-3.5 w-3.5 shrink-0" />
  </IconButton>
);

export const ToggleButton = ({ checked }: { checked: boolean }) => (
  <button
    type="submit"
    className="flex h-6 w-6 items-center justify-center bg-neutral-850"
  >
    {checked ? <FaCheck className="h-4 w-4 shrink-0" /> : undefined}
  </button>
);
