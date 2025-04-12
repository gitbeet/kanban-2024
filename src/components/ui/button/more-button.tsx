import { type ButtonHTMLAttributes, forwardRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const MoreButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ ...props }, ref) => (
  <button
    {...props}
    ref={ref}
    className="transition-colors--default h-6 w-6 shrink-0 rounded-full text-neutral-650 hover:text-neutral-850 dark:text-neutral-250 dark:hover:text-neutral-50"
  >
    <BsThreeDotsVertical className="h-full w-full" />
  </button>
));

MoreButton.displayName = "MoreButton";
export default MoreButton;
