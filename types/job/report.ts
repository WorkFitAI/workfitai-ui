export type ReportStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "DECLINE";

export interface Report {
  reportId: string;
  reportContent: string;
  imageUrls: string[];
  createdDate: string;
  createdBy: string;
}

export interface ReportedJob {
  jobId: string;
  title: string;
  companyName: string;
  status: ReportStatus;
  deleted: boolean;
  reportCount: number;
  reports: Report[];
}

export interface ReportedJobResponse {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: ReportedJob[];
}
