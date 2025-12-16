import { getJobs, putJob, deleteJob } from "@/lib/jobApi";
import { ReportedJobResponse } from "@/types/job/report";
import { ReportStatus } from "@/types/job/report";

export const getReportedJobs = async (params: {
    page?: number;        // FE: 1-based
    pageSize?: number;
    status?: ReportStatus;
}) => {
    const query = new URLSearchParams({
        page: String((params.page ?? 1) - 1), // BE 0-based
        pageSize: String(params.pageSize ?? 10),
    });

    // filter theo status
    if (params.status) {
        query.append("filter", `status:'${params.status}'`);
    }

    return getJobs<ReportedJobResponse>(
        `/public/admin/reports/grouped?${query.toString()}`
    );
};

export const updateReportedJobStatus = async (
    jobId: string,
    newStatus: ReportStatus
) => {
    return putJob<void>(
        `/public/admin/reports/${jobId}/status/${newStatus}`
    );
};


export const deleteReportedJob = async (jobId: string) => {
    return deleteJob<void>(`/public/admin/jobs/${jobId}`);
};
