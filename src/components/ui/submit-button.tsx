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
      className="h-8 border p-2 disabled:opacity-20"
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

export const CreateButton = () => (
  <SubmitButton icon={<FaPlus className="text-teal-300" />} />
);

export const ToggleButton = ({ checked }: { checked: boolean }) => (
  <SubmitButton
    icon={
      <div className="flex h-3 w-3 items-center justify-center">
        {checked ? <FaCheck /> : undefined}
      </div>
    }
  />
);

export default SubmitButton;
