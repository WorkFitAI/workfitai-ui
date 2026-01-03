import { getJobs, putJob, deleteJob } from "@/lib/jobApi";
import { ReportedJobResponse, ReqCreateReport } from "@/types/job/report";
import { ReportStatus } from "@/types/job/report";
import { jobRequestFormData } from "@/lib/jobApi";

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
        `/admin/reports/grouped?${query.toString()}`
    );
};

export const updateReportedJobStatus = async (
    jobId: string,
    newStatus: ReportStatus
) => {
    return putJob<void>(
        `/admin/reports/${jobId}/status/${newStatus}`
    );
};


export const deleteReportedJob = async (jobId: string) => {
    return deleteJob<void>(`/admin/jobs/${jobId}`);
};

export const createReport = async (data: ReqCreateReport, files?: File[]) => {
    const formData = new FormData();

    // Gói JSON data thành Blob để gửi dưới dạng multipart/form-data
    formData.append(
        "data",
        new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    // Thêm file nếu có
    files?.forEach((file) => formData.append("files", file));

    // Gọi API qua jobRequestFormData để tự xử lý token
    return jobRequestFormData<void>("/candidate/reports", formData);
};
