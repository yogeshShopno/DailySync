"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  error,
  hint,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[10px] font-bold text-theme-fg-muted uppercase tracking-wider mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`block w-full rounded-lg border bg-theme-bg-surface text-theme-fg text-sm py-2 px-3 outline-none placeholder:text-theme-fg-muted transition-colors duration-150 ${
          error
            ? "border-theme-error focus:border-theme-error focus:ring-2 focus:ring-[var(--theme-error-ring)]"
            : "border-theme-border hover:border-theme-border-hover focus:border-theme-border-focus focus:ring-2 focus:ring-theme-ring"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-theme-error">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs text-theme-fg-muted">{hint}</p>
      )}
    </div>
  );
}
