import type { KeyboardEvent } from "react";

export const handlePressEscape = (
  e: KeyboardEvent<Element>,
  action: () => void,
) => {
  if (e.key === "Escape") {
    e.preventDefault();
    action();
  }
};
