import type { KeyboardEvent } from "react";

export const handlePressEnterToSubmit = async (
  e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  submitAction: () => Promise<void> | void,
  cancelAction: () => void,
) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    await submitAction();
  }
  if (e.key === "Escape") {
    e.preventDefault();
    cancelAction();
  }
};
