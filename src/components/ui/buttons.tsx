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
  const variantClasses = `${variant === "primary" ? "border-transparent bg-white text-black shadow-md" : variant === "ghost" ? "border-neutral-300 text-white" : variant === "text" ? "border-transparent" : variant === "danger" ? "bg-red-500 text-white border-transparent" : ""}`;

  return (
    <button
      disabled={loading}
      {...props}
      className={` ${props.className} ${variantClasses} rounded border px-2 py-1 font-medium disabled:cursor-wait disabled:opacity-50`}
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
    className={`0 flex h-6 w-6 items-center justify-center bg-neutral-600 text-white disabled:pointer-events-none disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const EditButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props} className="flex h-6 w-6 items-center justify-center">
    <MdEdit className="h-full w-full" />
  </IconButton>
);

export const DeleteButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) => (
  <IconButton {...props} className="!bg-transparent hover:text-red-400">
    <FaTrash className="h-4 w-4 shrink-0" />
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
  <IconButton {...props} className="rounded-full hover:bg-red-500">
    <FaPlus className="h-4.5 w-4.5 shrink-0 rotate-45" />
  </IconButton>
);

export const SaveButton = ({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props} className="rounded-full hover:bg-teal-500">
    <FaCheck className="h-3.5 w-3.5 shrink-0" />
  </IconButton>
);

export const ToggleButton = ({ checked }: { checked: boolean }) => (
  <button
    type="submit"
    className="flex h-6 w-6 items-center justify-center bg-neutral-800"
  >
    {checked ? <FaCheck className="h-4 w-4 shrink-0" /> : undefined}
  </button>
);
