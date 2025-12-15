"use client";

import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { getSkills, ApiResponse } from "@/lib/skillApi";
import { SkillDataResponse, SkillOption } from "@/types/job/skill";

interface SkillsSelectProps {
  value: string[]; // skill NAMES
  onChange: (val: string[]) => void;
}

const SkillsSelect: React.FC<SkillsSelectProps> = ({ value, onChange }) => {
  const [options, setOptions] = useState<SkillOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        const res: ApiResponse<SkillDataResponse> =
          await getSkills<SkillDataResponse>("/public/skills");

        const skills = res.data?.result ?? [];

        // option chuẩn từ API
        const apiOptions: SkillOption[] = skills.map((s) => ({
          label: s.name,
          value: s.name,
        }));

        // merge skillName từ job nếu API chưa có
        const mergedOptions: SkillOption[] = [
          ...apiOptions,
          ...value
            .filter((name) => !apiOptions.some((opt) => opt.value === name))
            .map((name) => ({
              label: name,
              value: name,
            })),
        ];

        setOptions(mergedOptions);
      } catch (err) {
        console.error("Failed to fetch skills", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSkills();
  }, [value]);

  return (
    <Select<SkillOption, true>
      isMulti
      isLoading={loading}
      options={options}
      value={options.filter((opt) => value.includes(opt.value))}
      onChange={(selected: MultiValue<SkillOption>) =>
        onChange(selected.map((s) => s.value))
      }
      placeholder="Select skills..."
    />
  );
};

export default SkillsSelect;
