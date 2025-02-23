import { type MutableRefObject } from "react";

export const resizeTextArea = (ref: MutableRefObject<HTMLElement | null>) => {
  if (!ref.current) return;
  ref.current.style.height = "auto";
  ref.current.style.height = ref.current.scrollHeight + "px";
};
