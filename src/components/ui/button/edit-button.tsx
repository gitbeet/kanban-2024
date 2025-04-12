import { type ButtonHTMLAttributes } from "react";
import { IconButton } from "./icon-buton";
import { MdEdit } from "react-icons/md";

const EditButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props}>
    <MdEdit className="h-full w-full" />
  </IconButton>
);
export default EditButton;
