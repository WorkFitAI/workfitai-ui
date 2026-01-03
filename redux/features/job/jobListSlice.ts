import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJobs } from "@/lib/jobApi";
import { Job, Meta, JobResponse } from "@/types/job/job";
import { JobFilterState, buildFilterQuery } from "./jobFilterSlice";

interface FetchArgs {
    page?: number;
    size?: number;
    filter?: JobFilterState["filter"];
    sort?: string;
    role?: "USER" | "HR" | "ADMIN" | "HR_MANAGER";
}

const buildQuery = ({ page = 1, size = 12, filter, sort, role }: FetchArgs) => {
    const base =
        role === "ADMIN" || role === "HR" || role === "HR_MANAGER"
            ? "/hr/jobs"
                : "/public/jobs";
    let query = `${base}?page=${page - 1}&size=${size}`;

    if (filter && Object.keys(filter).length) {
        query += `&filter=${encodeURIComponent(buildFilterQuery(filter))}`;
    }

    if (sort === "Newest Post") query += `&sort=createdDate,desc`;
    if (sort === "Oldest Post") query += `&sort=createdDate,asc`;
    if (sort === "Rating Post") query += `&sort=rating,desc`;

    return query;
};

export const fetchAllJobs = createAsyncThunk(
    "jobs/fetchAll",
    async (args: FetchArgs) => {
        const res = await getJobs<JobResponse>(buildQuery(args));
        return res.data!;
    }
);

interface JobListState {
    page: number;
    meta: Meta;
    jobs: Job[];
    loading: boolean;
}

const initialState: JobListState = {
    page: 1,
    meta: { page: 1, pages: 0, total: 0, pageSize: 12 },
    jobs: [],
    loading: false,
};

const jobListSlice = createSlice({
    name: "jobList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllJobs.pending, (s) => {
                s.loading = true;
            })
            .addCase(fetchAllJobs.fulfilled, (s, a) => {
                s.loading = false;
                s.jobs = a.payload.result;
                s.meta = a.payload.meta;
            })
            .addCase(fetchAllJobs.rejected, (s) => {
                s.loading = false;
            });
    },
});

export const jobListReducer = jobListSlice.reducer;
