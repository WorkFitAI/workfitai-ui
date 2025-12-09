"use client";

import React from "react";

interface FormInputProps {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "date";
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  helpText?: string;
  error?: string;
  name?: string;
  disabled?: boolean;
}

export default function FormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  autoComplete,
  helpText,
  error,
  name,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>
        {label} {required && "*"}
      </label>
      <input
        className={`form-control ${error ? "is-invalid" : ""}`}
        id={id}
        type={type}
        required={required}
        name={name || id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        disabled={disabled}
      />
      {helpText && !error && (
        <small className="text-muted">{helpText}</small>
      )}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
