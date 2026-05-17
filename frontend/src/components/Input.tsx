import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ className = "", label, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-2 text-sm font-medium text-[#344054]" htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        className={`min-h-11 rounded-md border border-[#d6dbe6] bg-white px-3 text-[#172033] outline-none transition placeholder:text-[#98a2b3] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 ${className}`}
        {...props}
      />
    </label>
  );
}
