import type { ChangeEvent, InputHTMLAttributes } from "react";

const InputField = ({
  value,
  name,
  onChange,
  error,
  placeholder,
  type,
  textarea = false,
  autoFocus = false,
}: {
  value: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error: string;
  placeholder?: string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  textarea?: boolean;
  autoFocus?: boolean;
}) => {
  const sharedClasses = `w-full rounded-md border p-2 ${error ? "border-red-500 text-red-500" : "border-neutral-500 text-white"} bg-neutral-800`;

  return (
    <div className="relative top-4 w-full">
      {!textarea && (
        <input
          autoFocus={autoFocus}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`h-8 ${sharedClasses} `}
        />
      )}
      {textarea && (
        <textarea
          autoFocus={autoFocus}
          name={name}
          value={value}
          rows={2}
          onChange={onChange}
          placeholder={placeholder}
          className={sharedClasses}
        />
      )}
      <p className="h-8 text-red-500">{error && error}</p>
    </div>
  );
};

export default InputField;
