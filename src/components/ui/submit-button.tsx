"use client";

import { useFormStatus } from "react-dom";

const SubmitButton = ({ text }: { text: string }) => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="border p-2">
      {pending ? "Loading..." : text}
    </button>
  );
};

export default SubmitButton;
