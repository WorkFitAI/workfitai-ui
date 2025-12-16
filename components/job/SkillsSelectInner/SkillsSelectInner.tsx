"use client";

import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { getSkills, ApiResponse } from "@/lib/skillApi";
import { SkillDataResponse, SkillOption } from "@/types/job/skill";

interface SkillsSelectProps {
  value: string[];
  onChange: (val: string[]) => void;
}

const SkillsSelectInner: React.FC<SkillsSelectProps> = ({
  value,
  onChange,
}) => {
  const [options, setOptions] = useState<SkillOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        const res: ApiResponse<SkillDataResponse> =
          await getSkills<SkillDataResponse>("/public/skills");

        const skills = res.data?.result ?? [];

        const apiOptions: SkillOption[] = skills.map((s) => ({
          label: s.name,
          value: s.skillId,
        }));

        setOptions(apiOptions);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSkills();
  }, []);

  return (
    <Select<SkillOption, true>
      instanceId="skills-select"
      isMulti
      isLoading={loading}
      options={options}
      value={options.filter((opt) => value.includes(opt.value))}
      onChange={(selected: MultiValue<SkillOption>) =>
        onChange(selected.map((s) => s.value))
      }
      placeholder="At least 1 skill required!"
    />
  );
};

export default SkillsSelectInner;
