"use client";

import { useFormStatus } from "react-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const SubmitButton = ({
  text,
  pendingText = "Loading...",
  icon,
}: {
  text?: string;
  pendingText?: string;
  icon?: JSX.Element;
}) => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      className="border p-2 disabled:opacity-20"
    >
      {text}
      {icon}
      {/* {pending ? pendingText : text} */}
    </button>
  );
};

export const DeleteButton = () => (
  <SubmitButton icon={<FaTrash className="text-red-500" />} />
);

export const EditButton = () => (
  <SubmitButton icon={<FaEdit className="text-blue-400" />} />
);

export default SubmitButton;
