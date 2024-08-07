import { KeyboardEvent } from "react";

export const handlePressEnterToSubmit = async (
  e: KeyboardEvent<HTMLTextAreaElement>,
  action: () => Promise<void> | void,
) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    await action();
  }
};
