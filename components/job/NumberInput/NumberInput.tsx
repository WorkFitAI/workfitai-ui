"use client";

import React from "react";

interface NumberInputProps {
  value: number | "";
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  placeholder,
}) => {
  return (
    <input
      type="number"
      className="form-control"
      value={value}
      min={min}
      max={max}
      placeholder={placeholder}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "") return;

        let num = Number(v);
        if (isNaN(num)) return;

        if (min !== undefined) num = Math.max(min, num);
        if (max !== undefined) num = Math.min(max, num);

        onChange(num);
      }}
    />
  );
};

export default NumberInput;
