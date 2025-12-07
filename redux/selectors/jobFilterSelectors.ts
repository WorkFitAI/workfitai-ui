import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectJobFilters = (state: RootState) => state.jobFilter.filter;

export const selectEmploymentType = createSelector(
    [selectJobFilters],
    (filters) => {
        const arr = filters["employmentType"];
        return arr && arr.length > 0 ? arr : null;
    }
);
