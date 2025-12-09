"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addFilterValue,
  removeFilterValue,
} from "@/redux/features/job/jobFilterSlice";
import { selectEmploymentType } from "@/redux/selectors/jobFilterSelectors";

const WORK_TYPES = [
  { name: "On-site", enum: "ON_SITE" },
  { name: "Remote", enum: "REMOTE" },
  { name: "Full Time", enum: "FULL_TIME" },
  { name: "Part Time", enum: "PART_TIME" },
  { name: "Contract", enum: "CONTRACT" },
  { name: "Intern", enum: "INTERN" },
];

export default function WorkTypeFilter() {
  const dispatch = useAppDispatch();

  // Memoize selector để không tạo lại mỗi render
  const selectedFilters = useAppSelector(selectEmploymentType);

  const handleToggle = (enumName: string, checked: boolean) => {
    if (checked) {
      dispatch(addFilterValue({ field: "employmentType", value: enumName }));
    } else {
      dispatch(removeFilterValue({ field: "employmentType", value: enumName }));
    }
  };

  return (
    <div className="filter-block mb-20">
      <h5 className="medium-heading mb-15">Work Type</h5>
      <ul className="list-checkbox">
        {WORK_TYPES.map((item) => {
          const isChecked = !!selectedFilters?.includes(item.enum);
          return (
            <li key={item.enum}>
              <label className="cb-container">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleToggle(item.enum, e.target.checked)}
                />
                <span className="text-small">{item.name}</span>
                <span className="checkmark" />
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
