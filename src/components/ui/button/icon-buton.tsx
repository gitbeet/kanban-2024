"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { MdClose } from "react-icons/md";

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
