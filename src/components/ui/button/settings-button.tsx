import { IoSettingsSharp } from "react-icons/io5";
import { IconButton } from "./icon-buton";
import { type ButtonHTMLAttributes } from "react";

const SettingsButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <IconButton {...props}>
    <IoSettingsSharp className="h-full w-full" />
  </IconButton>
);

export default SettingsButton;
