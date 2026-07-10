"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-theme-gradient-start to-theme-gradient-end text-white hover:brightness-110 focus:ring-2 focus:ring-theme-ring shadow-md hover:shadow-lg",
  secondary:
    "bg-theme-bg-surface text-theme-fg border border-theme-border hover:bg-theme-bg-surface-hover focus:ring-2 focus:ring-theme-ring",
  success:
    "bg-theme-success text-theme-fg-inverse hover:bg-theme-success-hover focus:ring-2 focus:ring-[var(--theme-success-ring)] shadow-sm",
  danger:
    "bg-theme-error text-theme-fg-inverse hover:bg-theme-error-hover focus:ring-2 focus:ring-[var(--theme-error-ring)] shadow-sm",
  ghost:
    "bg-transparent text-theme-fg-secondary hover:bg-theme-bg-surface-hover focus:ring-2 focus:ring-theme-ring",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 cursor-pointer text-nowrap  outline-none disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
