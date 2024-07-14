import type { ChangeEvent, InputHTMLAttributes } from "react";

const InputField = ({
  value,
  name,
  onChange,
  error,
  placeholder,
  type,
}: {
  value: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string;
  placeholder: string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
}) => {
  return (
    <div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border ${error ? "border-red-500 text-red-500" : "border-neutral-400 text-white"} bg-neutral-800 p-2`}
      />
      <p className="text-red-500"> {error && error}</p>
    </div>
  );
};

export default InputField;
