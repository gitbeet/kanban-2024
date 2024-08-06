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
        className={`${className} input ${error ? "!border-danger-400 !text-danger-400" : "border-neutral-500"}`}
      />
      {error && <p className="h-8 text-xs text-danger-400">{error}</p>}
    </div>
  );
};

export default InputField;
