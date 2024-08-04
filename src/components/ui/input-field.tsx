import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error: string;
}

const InputField = ({ className, error, ...props }: InputProps) => {
  return (
    <div className={`relative ${error ? "top-4" : ""} w-full`}>
      <input
        {...props}
        className={`${className} input ${error ? "!border-red-500 !text-red-500" : "border-neutral-500"}`}
      />
      {error && <p className="h-8 text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
