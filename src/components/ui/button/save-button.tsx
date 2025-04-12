import { type ButtonHTMLAttributes } from "react";
import { IconButton } from "./icon-buton";
import { FaCheck } from "react-icons/fa";

const SaveButton = ({ ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props} variant="success">
    <FaCheck className="h-3.5 w-3.5 shrink-0" />
  </IconButton>
);

export default SaveButton;
