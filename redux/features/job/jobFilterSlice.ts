import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface JobFilterState {
    showSize: number;
    sortBy: string;
    filter: Record<string, string[]>;
}

const initialState: JobFilterState = {
    showSize: 12,
    sortBy: "Newest Post",
    filter: {},
};

export const jobFilterSlice = createSlice({
    name: "jobFilter",
    initialState,
    reducers: {
        setShowSize: (state, action: PayloadAction<number>) => {
            if (state.showSize !== action.payload) {
                state.showSize = action.payload;
            }
        },

        setFilter: (
            state,
            action: PayloadAction<JobFilterState["filter"]>
        ) => {
            state.filter = action.payload;
        },

        setSortBy: (state, action: PayloadAction<string>) => {
            if (state.sortBy !== action.payload) {
                state.sortBy = action.payload;
            }
        },

        addFilterValue: (
            state,
            action: PayloadAction<{ field: string; value: string }>
        ) => {
            const { field, value } = action.payload;

            // Chưa có field thì tạo
            if (!state.filter[field]) {
                state.filter[field] = [value];
                return;
            }

            // Đã có rồi thì không push lại
            if (!state.filter[field].includes(value)) {
                state.filter[field].push(value);
            }
        },

        removeFilterValue: (
            state,
            action: PayloadAction<{ field: string; value: string }>
        ) => {
            const { field, value } = action.payload;

            const existing = state.filter[field];
            if (!existing) return;

            // Nếu không thay đổi thì thôi
            if (!existing.includes(value)) return;

            // Filter ra array mới nhưng do Immer → vẫn merge an toàn
            const updated = existing.filter(v => v !== value);

            if (updated.length === 0) {
                delete state.filter[field];
            } else {
                state.filter[field] = updated;
            }
        },

        resetFilter: (state) => {
            state.filter = {};
        },
    },
});

// ===============================
// Helper build query string
// ===============================

export const buildFilterQuery = (filter: JobFilterState["filter"]) => {
    return Object.entries(filter)
        .map(([field, values]) => {
            if (!values.length) return "";

            // loại bỏ trùng lặp
            const uniqueValues = Array.from(new Set(values));

            // xử lý riêng cho salaryMin
            if (field === "salaryMin") {
                return `(${uniqueValues.map(v => `${field}${v}`).join(" OR ")})`;
            }

            // xử lý riêng cho salaryMax
            if (field === "salaryMax") {
                return `(${uniqueValues.map(v => `${field}${v}`).join(" OR ")})`;
            }

            // xử lý riêng cho title (fuzzy search)
            if (field === "title") {
                return `(${uniqueValues
                    .map(v => `${field}~~'${encodeURIComponent(v)}'`)
                    .join(" OR ")})`;
            }

            // xử lý riêng cho skills.name (mảng skill)
            if (field === "skills.name") {
                return `(${uniqueValues
                    .map(v => `${field} ~~ '${v}'`)
                    .join(" OR ")})`;
            }

            if (field === "location") {
                return `(${uniqueValues
                    .map(v => `${field} ~~ '${v}'`)
                    .join(" OR ")})`;
            }

            // Xử lý chung cho các field enum hoặc string khác
            if (uniqueValues.length === 1) {
                return `${field}:'${uniqueValues[0]}'`;
            }

            // Nếu nhiều giá trị → dùng IN
            return `${field} in [${uniqueValues.map(v => `'${v}'`).join(", ")}]`;
        })
        .filter(Boolean)
        .join(" AND ");
};

export const {
    setShowSize,
    setSortBy,
    addFilterValue,
    removeFilterValue,
    setFilter,
    resetFilter,
} = jobFilterSlice.actions;

export const jobFilterReducer = jobFilterSlice.reducer;
