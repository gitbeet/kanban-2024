import { cloneElement, isValidElement, type ReactElement } from "react";

type TextVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "tertiary"
  | "danger"
  | "success"
  | "inverse";

type Props = {
  variant: TextVariant;
  hover?: boolean;
  group?: boolean;
  children: ReactElement<{ className?: string }>;
};

const classesMap: Record<TextVariant, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-slate-500",
  danger: "text-red-500",
  accent: "text-purple-500",
  success: "text-teal-400",
  inverse: "text-slate-50 dark:text-slate-900",
};

// note: change group hover class when changing hover class
const hoverClassesMap: Record<TextVariant, string> = {
  primary: "hover:text-slate-600 dark:hover:text-slate-300",
  secondary: "hover:text-slate-800 dark:hover:text-slate-200",
  tertiary: "hover:text-slate-600 dark:hover:text-slate-400",
  danger: "hover:text-red-400",
  accent: "hover:text-purple-400",
  success: "hover:text-teal-300",
  inverse: "hover:text-white hover:dark:text-slate-950",
};

const groupHoverClassesMap: Record<TextVariant, string> = {
  primary: "group-hover:text-slate-600 dark:group-hover:text-slate-300",
  secondary: "group-hover:text-slate-800 dark:group-hover:text-slate-200",
  tertiary: "group-hover:text-slate-600 dark:group-hover:text-slate-400",
  danger: "group-hover:text-red-400",
  accent: "group-hover:text-purple-400",
  success: "group-hover:text-teal-300",
  inverse: "group-hover:text-white group-hover:dark:text-slate-950",
};

const Text = ({ variant, hover = false, group = false, children }: Props) => {
  const baseClasses = `${classesMap[variant]} ${hover ? `${group ? groupHoverClassesMap[variant] : hoverClassesMap[variant]} transition` : ""}`;

  if (!isValidElement(children)) {
    return <span className={baseClasses}>{children}</span>;
  }

  return cloneElement(children, {
    className: `${baseClasses} ${children.props.className ?? ""}`.trim(),
  });
};

export default Text;
