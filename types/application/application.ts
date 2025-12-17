// Application domain model
export interface Application {
  id: string;
  username: string;
  email: string;
  jobId: string;
  companyId: string;
  jobSnapshot: JobSnapshot;
  cvFileName: string;
  cvFileUrl: string;
  cvFileSize: number;
  coverLetter?: string;
  status: ApplicationStatus;
  isDraft: boolean;
  submittedAt?: string;
  assignedTo?: string;
  statusHistory: StatusChange[];
  notes: Note[];
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobSnapshot {
  title: string;
  companyName: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
}

export enum ApplicationStatus {
  DRAFT = "DRAFT",
  APPLIED = "APPLIED",
  REVIEWING = "REVIEWING",
  INTERVIEW = "INTERVIEW",
  OFFER = "OFFER",
  HIRED = "HIRED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN"
}

export interface StatusChange {
  previousStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export interface Note {
  id: string;
  author: string;
  content: string;
  candidateVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface ApplicationResponse {
  items: Application[];
  meta: PaginationMeta;
}

// Statistics types
export interface DashboardStats {
  totalApplications: number;
  statusBreakdown: Record<ApplicationStatus, number>;
  assignedToMe: number;
  recentApplications: Application[];
  weeklyTrend: {
    thisWeek: number;
    lastWeek: number;
    change: number;
  };
}

export interface JobStats {
  jobId: string;
  totalApplications: number;
  statusBreakdown: Record<ApplicationStatus, number>;
  conversionRates: {
    applyToReview: number;
    reviewToInterview: number;
    interviewToOffer: number;
    offerToHire: number;
  };
  averageTimeToReview: number;
  averageTimeToHire: number;
}

export interface ManagerStats {
  companyId: string;
  totalApplications: number;
  statusBreakdown: Record<ApplicationStatus, number>;
  teamPerformance: TeamMember[];
  topJobs: TopJob[];
  monthlyTrend: {
    thisMonth: number;
    lastMonth: number;
    change: number;
  };
}

export interface TeamMember {
  hrUsername: string;
  assignedCount: number;
  completedCount: number;
  avgTimeToReview: number;
}

export interface TopJob {
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicationCount: number;
  hiredCount: number;
}

export interface SystemStats {
  platformTotals: {
    totalApplications: number;
    totalCompanies: number;
    totalJobs: number;
    totalCandidates: number;
  };
  statusDistribution: Record<ApplicationStatus, number>;
  growthMetrics: {
    last7Days: number;
    last30Days: number;
    last1Year: number;
    last2Years: number;
    monthOverMonth: number;
    yearOverYear: number;
  };
  topCompanies: TopCompany[];
  topJobs: TopJob[];
  averageTimeToHire: number;
}

export interface TopCompany {
  companyId: string;
  companyName: string;
  applicationCount: number;
  jobCount: number;
  hiredCount: number;
}

// API request/response types
export interface CreateApplicationRequest {
  jobId: string;
  email: string;
  cvPdfFile: File;
  coverLetter?: string;
}

export interface UpdateStatusRequest {
  status: ApplicationStatus;
  reason?: string;
}

export interface BulkUpdateStatusRequest {
  applicationIds: string[];
  status: ApplicationStatus;
  reason?: string;
}

export interface AddNoteRequest {
  content: string;
  candidateVisible?: boolean;
}

export interface AssignApplicationRequest {
  assignedTo: string;
}

export interface ExportRequest {
  companyId: string;
  format: 'csv' | 'excel';
  jobIds?: string[];
  status?: ApplicationStatus;
  fromDate?: string;
  toDate?: string;
  columns?: string[];
}

export interface ExportResponse {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  recordCount: number;
  expiresAt: string;
}

export interface CVDownloadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  expiresAt: string;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  performedAt: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  metadata: Record<string, unknown>;
  containsPII: boolean;
}
