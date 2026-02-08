/**
 * Input Component
 * Reusable form input with validation feedback
 */

import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export function Input({
  label,
  error,
  helpText,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id || props.name || "input";

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-secondary"
        >
          {label}
          {props.required && <span className="text-error"> *</span>}
        </label>
      )}

      <input
        id={inputId}
        className={`
          w-full px-4 py-2 border rounded-lg min-h-11
           text-text-primary placeholder:text-text-secondary/40
          border-cards
          focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
          transition-all
          ${error ? "border-error bg-error/10" : ""}
          ${className}
        `}
        {...props}
      />

      {error && <p className="text-sm text-error">{error}</p>}
      {helpText && !error && (
        <p className="text-sm text-text-secondary">{helpText}</p>
      )}
    </div>
  );
}
