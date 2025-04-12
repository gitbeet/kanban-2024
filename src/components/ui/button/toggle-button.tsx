import { type ButtonHTMLAttributes } from "react";
import { FaCheck } from "react-icons/fa";

type ToggleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  checked: boolean;
  size?: "small" | "base";
};

const ToggleButton = ({
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

export default ToggleButton;
