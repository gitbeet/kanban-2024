import { FaPlus } from "react-icons/fa";
import { IconButton } from "./icon-buton";
import { type ButtonHTMLAttributes } from "react";

export const CancelButton = ({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props} variant="danger">
    <FaPlus className="h-4.5 w-4.5 shrink-0 rotate-45" />
  </IconButton>
);

export default CancelButton;
