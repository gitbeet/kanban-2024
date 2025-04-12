import { type ButtonHTMLAttributes } from "react";
import { IconButton } from "./icon-buton";
import { MdClose } from "react-icons/md";

const CloseButton = ({ ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props}>
    <MdClose className="h-6 w-6 shrink-0" />
  </IconButton>
);

export default CloseButton;
