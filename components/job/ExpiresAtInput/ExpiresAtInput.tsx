"use client";

import React from "react";

interface ExpiresAtInputProps {
  value: string; // ISO date string
  onChange: (val: string) => void;
  min?: string;
}

const ExpiresAtInput: React.FC<ExpiresAtInputProps> = ({
  value,
  onChange,
  min,
}) => {
  return (
    <input
      type="date"
      value={value ? value.split("T")[0] : ""}
      min={min || new Date().toISOString().split("T")[0]}
      onChange={(e) => onChange(e.target.value)}
      className="form-control"
    />
  );
};

export default ExpiresAtInput;
