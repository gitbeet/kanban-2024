"use client";

import { useFormStatus } from "react-dom";

const SubmitButton = ({
  text,
  pendingText = "Loading...",
}: {
  text: string;
  pendingText?: string;
}) => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      className="border p-2 disabled:opacity-20"
    >
      {text}
      {/* {pending ? pendingText : text} */}
    </button>
  );
};

export default SubmitButton;
