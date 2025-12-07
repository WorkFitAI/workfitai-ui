"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addFilterValue,
  removeFilterValue,
} from "@/redux/features/job/jobFilterSlice";

export default function SalaryFilter() {
  const dispatch = useAppDispatch();

  const selectedMin = useAppSelector(
    (state) => state.jobFilter.filter.salaryMin?.[0]
  );
  const selectedMax = useAppSelector(
    (state) => state.jobFilter.filter.salaryMax?.[0]
  );

  const selMinNum = selectedMin
    ? Number(selectedMin.replace(">:", ""))
    : undefined;
  const selMaxNum = selectedMax
    ? Number(selectedMax.replace("<:", ""))
    : undefined;

  const ranges = [
    { label: "All", min: undefined, max: undefined, count: 145 },
    { label: "$0 - $200", min: 0, max: 200, count: 56 },
    { label: "$200 - $400", min: 200, max: 400, count: 37 },
    { label: "$400 - $600", min: 400, max: 600, count: 75 },
    { label: "$600 - $800", min: 600, max: 800, count: 98 },
    { label: "$800 - $1000", min: 800, max: 1000, count: 14 },
    { label: "$1000 - $2000", min: 1000, max: 2000, count: 25 },
  ];

  const handleToggle = (min?: number, max?: number) => {
    // Xóa toàn bộ filter salary đang có
    if (selMinNum !== undefined)
      dispatch(
        removeFilterValue({ field: "salaryMin", value: `>:${selMinNum}` })
      );

    if (selMaxNum !== undefined)
      dispatch(
        removeFilterValue({ field: "salaryMax", value: `<:${selMaxNum}` })
      );

    // Nếu bấm "All" thì thôi, không add gì cả
    if (min === undefined && max === undefined) return;

    // Add filter mới theo format BE
    if (min !== undefined)
      dispatch(addFilterValue({ field: "salaryMin", value: `>:${min}` }));

    if (max !== undefined)
      dispatch(addFilterValue({ field: "salaryMax", value: `<:${max}` }));
  };

  return (
    <div className="filter-block mb-20">
      <h5 className="medium-heading mb-25">Salary Range</h5>

      <div className="form-group mb-20">
        <ul className="list-checkbox">
          {ranges.map((item, idx) => {
            const isChecked = selMinNum === item.min && selMaxNum === item.max;

            // Special case: ALL
            const isAllChecked =
              item.min === undefined &&
              item.max === undefined &&
              selMinNum === undefined &&
              selMaxNum === undefined;

            return (
              <li key={idx}>
                <label className="cb-container">
                  <input
                    type="checkbox"
                    checked={item.label === "All" ? isAllChecked : isChecked}
                    onChange={() => handleToggle(item.min, item.max)}
                  />
                  <span className="text-small">{item.label}</span>
                  <span className="checkmark" />
                </label>
                <span className="number-item">{item.count}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
