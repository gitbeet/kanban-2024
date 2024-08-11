import type { KeyboardEvent } from "react";

export const handlePressEnter = async (
  e: KeyboardEvent<Element>,
  action: () => Promise<void> | void,
) => {
  if (e.key === "Enter") {
    e.preventDefault();
    await action();
  }
};
