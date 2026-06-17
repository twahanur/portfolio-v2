"use client";

import React from "react";

type FieldType = "text" | "email" | "url" | "number" | "password" | "textarea" | "select";

interface SelectOption {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  type?: FieldType;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  /** For textarea */
  rows?: number;
  /** For select */
  options?: SelectOption[];
  /** Span full width in 2-col grid */
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

const INPUT_CLASS =
  "block w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-zinc-200 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed";

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  rows = 3,
  options,
  fullWidth = false,
  disabled = false,
  className = "",
}: FormFieldProps) {
  const wrapperClass = `space-y-2 ${fullWidth ? "md:col-span-2" : ""} ${className}`;

  const renderInput = () => {
    if (type === "textarea") {
      return (
        <textarea
          rows={rows}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={INPUT_CLASS}
        />
      );
    }

    if (type === "select" && options) {
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={INPUT_CLASS}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={INPUT_CLASS}
      />
    );
  };

  return (
    <div className={wrapperClass}>
      <label className="block text-sm font-semibold text-zinc-350">{label}</label>
      {renderInput()}
    </div>
  );
}
