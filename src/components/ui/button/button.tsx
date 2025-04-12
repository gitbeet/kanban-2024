import { type ButtonHTMLAttributes } from "react";
import LoadingPage from "../loading/loading-page";

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
