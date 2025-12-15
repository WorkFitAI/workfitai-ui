"use client";

import React from "react";

interface OpeningPositionInputProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

const OpeningPositionInput: React.FC<OpeningPositionInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 100,
}) => {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) {
          onChange(Math.min(Math.max(val, min), max));
        } else {
          onChange(min); // fallback nếu rỗng
        }
      }}
      className="form-control"
      placeholder={`Enter number of positions (${min}-${max})`}
    />
  );
};

export default OpeningPositionInput;
