import { type ButtonHTMLAttributes } from "react";
import { IconButton } from "./icon-buton";
import { FaTrash } from "react-icons/fa";

const DeleteButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props} variant="danger">
    <FaTrash />
  </IconButton>
);

export default DeleteButton;
