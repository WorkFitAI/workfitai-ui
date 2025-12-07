import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJobs } from "@/lib/jobApi";
import { Job, Meta } from "@/types/job/job";
import { JobResponse } from "@/types/job/job";
import { JobFilterState, buildFilterQuery } from './jobFilterSlice';

const buildQuery = ({
    page = 1,
    size = 12,
    filter,
    sort,
}: {
    page?: number;
    size?: number;
    filter?: JobFilterState['filter'];
    sort?: string;
}) => {
    let query = `/public/jobs?page=${page - 1}&size=${size}`;

    if (filter && Object.keys(filter).length > 0) {
        const filterString = buildFilterQuery(filter);
        query += `&filter=${encodeURIComponent(filterString)}`;
    }

    switch (sort) {
        case "Newest Post":
            query += `&sort=createdDate,desc`;
            break;
        case "Oldest Post":
            query += `&sort=createdDate,asc`;
            break;
        case "Rating Post":
            query += `&sort=rating,desc`;
            break;
    }

    return query;
};

export const fetchAllJobs = createAsyncThunk(
    "jobs/all",
    async ({
        page = 1,
        size = 12,
        filter = {},
        sort = "",
    }: {
        page?: number;
        size?: number;
        filter?: JobFilterState['filter'];
        sort?: string;
    }) => {
        const query = buildQuery({ page, size, filter, sort });
        const res = await getJobs<JobResponse>(query);
        return res.data!;
    }
);

interface JobListState {
    meta: Meta;
    jobs: Job[];
    loading: boolean;
    error?: string | null;
}

const initialState: JobListState = {
    meta: {
        page: 1,
        total: 0,
        pages: 0,
        pageSize: 12,
    },
    jobs: [],
    loading: false,
};

const jobListSlice = createSlice({
    name: "jobList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllJobs.fulfilled, (state, action) => {
                state.loading = false;

                // Gán meta mới
                const meta = action.payload.meta;
                state.meta.page = (meta.page ?? 0) + 1;
                state.meta.total = meta.total;
                state.meta.pages = meta.pages;
                state.meta.pageSize = meta.pageSize;

                state.jobs = action.payload.result;
            })
            .addCase(fetchAllJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Cannot load jobs after 3 retries.";
            });
    },
});

export const jobListReducer = jobListSlice.reducer;
