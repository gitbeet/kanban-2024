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
  tertiary: "text-tertiary",
  danger: "text-danger",
  accent: "text-accent",
  success: "text-success",
  inverse: "text-inverse",
};

// note: change group hover class when changing hover class
const hoverClassesMap: Record<TextVariant, string> = {
  primary: "text-primary__hover",
  secondary: "text-secondary__hover",
  tertiary: "text-tertiary__hover",
  danger: "text-danger__hover",
  accent: "text-accent__hover",
  success: "text-success__hover",
  inverse: "text-inverse__hover",
};

const groupHoverClassesMap: Record<TextVariant, string> = {
  primary: "text-primary__group-hover",
  secondary: "text-secondary__group-hover",
  tertiary: "text-tertiary__group-hover",
  danger: "text-danger__group-hover",
  accent: "text-accent__group-hover",
  success: "text-success__group-hover",
  inverse: "text-inverse__group-hover",
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
