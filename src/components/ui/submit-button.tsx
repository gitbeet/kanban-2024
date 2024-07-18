"use client";

import { useFormStatus } from "react-dom";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

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
      className="rounded border border-neutral-400 bg-white px-2 py-1 font-medium text-black disabled:opacity-20"
    >
      {text}
      {icon}
      {/* {pending ? pendingText : text} */}
    </button>
  );
};

export const DeleteButton = () => (
  <button
    type="submit"
    className="flex h-6 w-6 items-center justify-center text-neutral-400 hover:text-red-400"
  >
    <FaTrash className="h-4 w-4 shrink-0" />
  </button>
);

export const EditButton = () => (
  <button
    type="submit"
    className="flex h-6 w-6 items-center justify-center text-neutral-400 hover:text-neutral-300"
  >
    <FaEdit className="h-4 w-4 shrink-0" />
  </button>
);

export const CreateButton = () => (
  <SubmitButton icon={<FaPlus className="text-teal-300" />} />
);

export const ToggleButton = ({ checked }: { checked: boolean }) => (
  <button
    type="submit"
    className="flex h-6 w-6 items-center justify-center bg-neutral-600"
  >
    {checked ? <FaCheck className="h-4 w-4 shrink-0" /> : undefined}
  </button>
);

export default SubmitButton;
