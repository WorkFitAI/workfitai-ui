"use client";

import React, { useMemo } from "react";
import Select, { SingleValue } from "react-select";

// Option cho experience level
export interface ExperienceOption {
  label: string;
  value: string;
}

interface ExperienceLevelSelectProps {
  value: string;
  onChange: (val: string) => void;
}

// Danh sách cứng
const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  { label: "Fresher", value: "FRESHER" },
  { label: "Junior", value: "JUNIOR" },
  { label: "Mid", value: "MID" },
  { label: "Senior", value: "SENIOR" },
  { label: "Lead", value: "LEAD" },
];

const ExperienceLevelSelect: React.FC<ExperienceLevelSelectProps> = ({
  value,
  onChange,
}) => {
  // Merge value cũ nếu chưa có trong list
  const optionsWithValue = useMemo(() => {
    if (!value) return EXPERIENCE_OPTIONS;
    const exists = EXPERIENCE_OPTIONS.some((opt) => opt.value === value);
    if (exists) return EXPERIENCE_OPTIONS;
    // Nếu value cũ không có trong list, merge thêm
    return [...EXPERIENCE_OPTIONS, { label: value, value }];
  }, [value]);

  return (
    <Select<ExperienceOption, false>
      options={optionsWithValue}
      value={optionsWithValue.find((opt) => opt.value === value) || null}
      onChange={(selected: SingleValue<ExperienceOption>) =>
        onChange(selected ? selected.value : "")
      }
      placeholder="Select experience level..."
    />
  );
};

export default ExperienceLevelSelect;
