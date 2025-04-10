import { cloneElement, isValidElement, type ReactElement } from "react";

type TextVariant = "primary" | "secondary" | "accent" | "danger" | "success";

type Props = {
  variant: TextVariant;
  children: ReactElement<{ className?: string }>;
};

const classesMap: Record<TextVariant, string> = {
  primary: "text-slate-900 dark:text-slate-50",
  secondary: "text-slate-600 dark:text-slate-400",
  danger: "text-red-500",
  accent: "text-purple-500",
  success: "text-teal-400",
};

const Text = ({ variant, children }: Props) => {
  const baseClasses = classesMap[variant];

  if (!isValidElement(children)) {
    return <span className={baseClasses}>{children}</span>;
  }

  return cloneElement(children, {
    className: `${baseClasses} ${children.props.className ?? ""}`.trim(),
  });
};

export default Text;
