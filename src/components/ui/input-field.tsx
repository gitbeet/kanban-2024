import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error: string;
  labelText?: string;
}

const InputField = ({ className, error, labelText, ...props }: InputProps) => {
  return (
    <div className="relative w-full">
      <div className="flex justify-between pb-2 text-sm">
        {labelText && <label htmlFor={props.id}>{labelText}</label>}
        {error && <p className="text-danger-400">{error}</p>}
      </div>
      <input
        {...props}
        className={`${className} input ${error ? "!border-danger-400 !text-danger-400" : "border-neutral-500"}`}
      />
    </div>
  );
};

export default InputField;
