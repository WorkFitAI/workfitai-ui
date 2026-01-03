"use client";

import React, { useMemo } from "react";
import Select, { SingleValue } from "react-select";

// Option cho job type
export interface JobTypeOption {
  label: string;
  value: string;
}

interface JobTypeSelectProps {
  value: string;
  onChange: (val: string) => void;
}

// Danh sách job type cứng
const JOB_TYPE_OPTIONS: JobTypeOption[] = [
  { label: "Full-time", value: "FULL_TIME" },
  { label: "Part-time", value: "PART_TIME" },
  { label: "Internship", value: "INTERN" },
  { label: "Contract", value: "CONTRACT" },
];

const JobTypeSelect: React.FC<JobTypeSelectProps> = ({ value, onChange }) => {
  const optionsWithValue = useMemo(() => {
    if (!value) return JOB_TYPE_OPTIONS;
    const exists = JOB_TYPE_OPTIONS.some((opt) => opt.value === value);
    if (exists) return JOB_TYPE_OPTIONS;
    return [...JOB_TYPE_OPTIONS, { label: value, value }];
  }, [value]);

  return (
    <Select<JobTypeOption, false>
      options={optionsWithValue}
      value={optionsWithValue.find((opt) => opt.value === value) || null}
      onChange={(selected: SingleValue<JobTypeOption>) =>
        onChange(selected ? selected.value : "")
      }
      placeholder="Select job type..."
    />
  );
};

export default JobTypeSelect;
