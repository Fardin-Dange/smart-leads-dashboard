import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{
    label: string;
    value: string;
  }>;
}

export function Select({ className = "", label, id, name, options, ...props }: SelectProps) {
  const selectId = id ?? name;

  return (
    <label className="grid gap-2 text-sm font-medium text-[#344054]" htmlFor={selectId}>
      {label}
      <select
        id={selectId}
        name={name}
        className={`min-h-11 rounded-md border border-[#d6dbe6] bg-white px-3 text-[#172033] outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
