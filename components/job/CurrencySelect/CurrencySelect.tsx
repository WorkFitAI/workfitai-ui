"use client";

import React, { useMemo } from "react";
import Select, { SingleValue } from "react-select";

export interface CurrencyOption {
  label: string;
  value: string;
}

interface CurrencySelectProps {
  value: string;
  onChange: (val: string) => void;
}

// Chỉ cho phép USD & VND
const CURRENCY_OPTIONS: CurrencyOption[] = [
  { label: "USD ($)", value: "USD" },
  { label: "VND (₫)", value: "VND" },
];

const CurrencySelect: React.FC<CurrencySelectProps> = ({ value, onChange }) => {
  const optionsWithValue = useMemo(() => {
    if (!value) return CURRENCY_OPTIONS;

    const exists = CURRENCY_OPTIONS.some((opt) => opt.value === value);

    if (exists) return CURRENCY_OPTIONS;

    // fallback nếu backend trả currency lạ
    return [...CURRENCY_OPTIONS, { label: value, value }];
  }, [value]);

  return (
    <Select<CurrencyOption, false>
      options={optionsWithValue}
      value={optionsWithValue.find((opt) => opt.value === value) || null}
      onChange={(selected: SingleValue<CurrencyOption>) =>
        onChange(selected ? selected.value : "")
      }
      placeholder="Select currency..."
    />
  );
};

export default CurrencySelect;
