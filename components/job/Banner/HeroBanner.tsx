"use client";

import React, { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addFilterValue,
  removeFilterValue,
  JobFilterState,
} from "@/redux/features/job/jobFilterSlice";
import { fetchAllJobs } from "@/redux/features/job/jobListSlice";

export default function HeroBanner() {
  const dispatch = useAppDispatch();
  const reduxFilter = useAppSelector((state) => state.jobFilter.filter);
  const showSize = useAppSelector((state) => state.jobFilter.showSize);
  const sortBy = useAppSelector((state) => state.jobFilter.sortBy);

  // ---------- Local state ----------
  const [keyword, setKeyword] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");

  // ---------- Refs ----------
  const lastCalledFilter = useRef<JobFilterState["filter"]>({});
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // ---------- Debounce 5s chung ----------
  const triggerDebouncedFetch = (newFilter: JobFilterState["filter"]) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const currentStr = JSON.stringify(newFilter);
      const prevStr = JSON.stringify(lastCalledFilter.current);

      if (currentStr === prevStr) return; // filter giống lần trước → bỏ qua

      // Sync Redux filter với local state
      Object.entries(newFilter).forEach(([field, values]) => {
        const oldValues = reduxFilter[field] || [];
        oldValues.forEach((v) => {
          if (!values.includes(v))
            dispatch(removeFilterValue({ field, value: v }));
        });
        values.forEach((v) => {
          if (!oldValues.includes(v))
            dispatch(addFilterValue({ field, value: v }));
        });
      });

      // Gọi API
      dispatch(
        fetchAllJobs({
          page: 1,
          size: showSize,
          filter: newFilter,
          sort: sortBy,
        })
      );

      lastCalledFilter.current = JSON.parse(currentStr);
    }, 5000);
  };

  // ---------- Handlers ----------
  const handleKeywordChange = (value: string) => {
    setKeyword(value); // ✅ luôn giữ input
    const newFilter: JobFilterState["filter"] = {
      title: value ? [value] : [],
      industry: industry && industry !== "0" ? [industry] : [],
      location: location ? [location] : [],
    };
    triggerDebouncedFetch(newFilter);
  };

  const handleIndustryChange = (value: string) => {
    setIndustry(value);
    if (!value || value === "0") return; // không gọi nếu về mặc định

    const newFilter: JobFilterState["filter"] = {
      title: keyword ? [keyword] : [],
      industry: [value],
      location: location ? [location] : [],
    };
    triggerDebouncedFetch(newFilter);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    if (!value) return; // không gọi nếu về mặc định

    const newFilter: JobFilterState["filter"] = {
      title: keyword ? [keyword] : [],
      industry: industry && industry !== "0" ? [industry] : [],
      location: [value],
    };
    triggerDebouncedFetch(newFilter);
  };

  return (
    <section className="section-box-2">
      <div className="container">
        <div className="banner-hero banner-single banner-single-bg">
          <div className="block-banner text-center">
            <h3>
              <span className="color-brand-2">22 Jobs</span> Available Now
            </h3>

            <div className="form-find text-start mt-40">
              <form onSubmit={(e) => e.preventDefault()}>
                {/* Industry */}
                <div className="box-industry">
                  <select
                    className="form-input mr-10"
                    value={industry}
                    onChange={(e) => handleIndustryChange(e.target.value)}
                  >
                    <option value="0">Industry</option>
                    <option value="Software">Software</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                {/* Location */}
                <div className="box-industry">
                  <select
                    className="form-input mr-10"
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                  >
                    <option value="">Location</option>
                    <option value="HN">Hà Nội</option>
                    <option value="HCM">TP. Hồ Chí Minh</option>
                  </select>
                </div>

                {/* Keyword */}
                <input
                  className="form-input input-keysearch mr-10"
                  type="text"
                  placeholder="Your keyword..."
                  value={keyword} // luôn giữ local state
                  onChange={(e) => handleKeywordChange(e.target.value)}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
