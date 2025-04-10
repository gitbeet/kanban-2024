import { cloneElement, isValidElement, type ReactElement } from "react";

const VerticalGradientText = ({
  children,
}: {
  children: ReactElement<{ className?: string }>;
}) => {
  const baseClasses =
    "bg-gradient-to-b from-slate-500 to-slate-900 bg-clip-text text-transparent dark:from-slate-50 dark:to-slate-300";

  if (!isValidElement(children)) {
    return <span className={baseClasses}>{children}</span>;
  }

  return cloneElement(children, {
    className: `${baseClasses} ${children.props.className ?? ""}`.trim(),
  });
};

export default VerticalGradientText;
