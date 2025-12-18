import React from "react";

type Option = {
  label: string;
  value: string;
};

interface FormFieldProps<T extends object> {
  label: string;
  name: keyof T;
  value: T[keyof T];
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  required?: boolean;
  rows?: number;
  type?: string;
  placeholder?: string;
  options?: Option[];
}

export default function FormField<T extends object>({
  label,
  name,
  value,
  onChange,
  required,
  rows,
  type = "text",
  placeholder,
  options,
}: FormFieldProps<T>) {
  return (
    <div className="mb-3">
      <label className="form-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>

      {options ? (
        <select
          name={name as string}
          className="form-select form-select-lg"
          value={value as string}
          onChange={onChange}
          required={required}
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : rows ? (
        <textarea
          name={name as string}
          className="form-control"
          rows={rows}
          value={value as string}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          name={name as string}
          type={type}
          className="form-control"
          value={value as string | number}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
}
