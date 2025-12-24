import type {
  Application,
  ApplicationResponse,
  CreateApplicationRequest,
  UpdateStatusRequest,
  BulkUpdateStatusRequest,
  AddNoteRequest,
  Note,
  AssignApplicationRequest,
  ExportResponse,
  DashboardStats,
  JobStats,
  ManagerStats,
  SystemStats,
  AuditLog,
  StatusChange,
  HRUser,
  HRActivitiesResponse,
} from "@/types/application/application";
import { applicationClient, APPLICATION_BASE_URL } from "@/lib/axios-client";
import type { AxiosError } from "axios";

// Generic request wrapper using axios client
async function applicationRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  try {
    const response = await applicationClient.request<{ data?: T } | T>({
      url: path,
      method: options.method || "GET",
      data: options.body,
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    const responseData = response.data;
    // Unwrap data if nested
    if (responseData && typeof responseData === "object" && "data" in responseData) {
      return (responseData as { data: T }).data;
    }
    return responseData as T;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message ||
        axiosError.message ||
        "Request failed"
    );
  }
}

// FormData request wrapper
async function applicationRequestFormData<T>(
  path: string,
  formData: FormData
): Promise<T> {
  try {
    const response = await applicationClient.request<{ data?: T } | T>({
      url: path,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const responseData = response.data;
    if (responseData && typeof responseData === "object" && "data" in responseData) {
      return (responseData as { data: T }).data;
    }
    return responseData as T;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message ||
        axiosError.message ||
        "Request failed"
    );
  }
}

// Candidate endpoints
export const createApplication = async (
  request: CreateApplicationRequest
): Promise<Application> => {
  const formData = new FormData();
  formData.append("jobId", request.jobId);
  formData.append("email", request.email);
  formData.append("cvPdfFile", request.cvPdfFile);
  if (request.coverLetter) {
    formData.append("coverLetter", request.coverLetter);
  }

  return applicationRequestFormData<Application>("", formData);
};

export const getMyApplications = async (params: {
  page: number;
  size: number;
  status?: string;
}): Promise<ApplicationResponse> => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
    ...(params.status && { status: params.status }),
  });

  return applicationRequest<ApplicationResponse>(`/my?${query}`);
};

export const getApplicationById = async (id: string): Promise<Application> => {
  // Fetch both application and history in parallel
  const [application, history] = await Promise.all([
    applicationRequest<Application>(`/${id}`),
    applicationRequest<StatusChange[]>(`/${id}/history`),
  ]);

  // Merge history into application
  return {
    ...application,
    statusHistory: history,
  };
};

export const getApplicationHistory = async (
  id: string
): Promise<StatusChange[]> => {
  return applicationRequest<StatusChange[]>(`/${id}/history`);
};

export const checkIfApplied = async (
  jobId: string
): Promise<{ applied: boolean }> => {
  return applicationRequest<{ applied: boolean }>(`/check?jobId=${jobId}`);
};

export const withdrawApplication = async (id: string): Promise<void> => {
  return applicationRequest<void>(`/${id}`, { method: "DELETE" });
};

export const getMyApplicationCount = async (): Promise<{ count: number }> => {
  return applicationRequest<{ count: number }>("/my/count");
};

export const getPublicNotes = async (id: string): Promise<Note[]> => {
  return applicationRequest<Note[]>(`/${id}/notes/public`);
};

// HR endpoints
export const getApplicationsForJob = async (params: {
  jobId: string;
  page: number;
  size: number;
  status?: string;
}): Promise<ApplicationResponse> => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
    ...(params.status && { status: params.status }),
  });

  return applicationRequest<ApplicationResponse>(
    `/job/${params.jobId}?${query}`
  );
};

export const getMyAssignedApplications = async (params: {
  page: number;
  size: number;
}): Promise<ApplicationResponse> => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
  });

  return applicationRequest<ApplicationResponse>(`/assigned/my?${query}`);
};

export const updateStatus = async (
  id: string,
  request: UpdateStatusRequest
): Promise<Application> => {
  const params = new URLSearchParams({
    status: request.status,
    ...(request.reason && { reason: request.reason }),
  });

  return applicationRequest<Application>(`/${id}/status?${params}`, {
    method: "PUT",
  });
};

export const bulkUpdateStatus = async (
  request: BulkUpdateStatusRequest
): Promise<{ successCount: number; failureCount: number }> => {
  return applicationRequest<{ successCount: number; failureCount: number }>(
    "/bulk/status",
    {
      method: "PUT",
      body: request,
    }
  );
};

export const addNote = async (
  id: string,
  request: AddNoteRequest
): Promise<Note> => {
  return applicationRequest<Note>(`/${id}/notes`, {
    method: "POST",
    body: request,
  });
};

export const getAllNotes = async (id: string): Promise<Note[]> => {
  return applicationRequest<Note[]>(`/${id}/notes`);
};

export const updateNote = async (
  id: string,
  noteId: string,
  request: Partial<AddNoteRequest>
): Promise<Note> => {
  return applicationRequest<Note>(`/${id}/notes/${noteId}`, {
    method: "PUT",
    body: request,
  });
};

export const deleteNote = async (id: string, noteId: string): Promise<void> => {
  return applicationRequest<void>(`/${id}/notes/${noteId}`, {
    method: "DELETE",
  });
};

export const downloadCV = async (id: string): Promise<Blob> => {
  const response = await applicationClient.get(`/${id}/cv/download`, {
    responseType: "blob",
  });
  return response.data;
};

// HR Manager endpoints
export const getCompanyApplications = async (params: {
  companyId: string;
  page: number;
  size: number;
  status?: string;
  assignedTo?: string;
}): Promise<ApplicationResponse> => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
    ...(params.status && { status: params.status }),
    ...(params.assignedTo && { assignedTo: params.assignedTo }),
  });

  return applicationRequest<ApplicationResponse>(
    `/company/${params.companyId}?${query}`
  );
};

export const assignApplication = async (
  id: string,
  request: AssignApplicationRequest
): Promise<Application> => {
  return applicationRequest<Application>(`/${id}/assign`, {
    method: "PUT",
    body: request,
  });
};

export const unassignApplication = async (id: string): Promise<Application> => {
  return applicationRequest<Application>(`/${id}/assign`, { method: "DELETE" });
};

export const getAssignedApplications = async (params: {
  hrUsername: string;
  page: number;
  size: number;
  status?: string;
}): Promise<ApplicationResponse> => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
    ...(params.status && { status: params.status }),
  });

  return applicationRequest<ApplicationResponse>(
    `/assigned/${params.hrUsername}?${query}`
  );
};

export const getUnassignedApplications = async (params: {
  page: number;
  size: number;
}): Promise<ApplicationResponse> => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
  });

  return applicationRequest<ApplicationResponse>(
    `/company/unassigned?${query}`
  );
};

export const getCompanyHRUsers = async (
  companyId: string
): Promise<HRUser[]> => {
  return applicationRequest<HRUser[]>(`/company/${companyId}/hr-users`);
};

// Admin endpoints
export const getAllApplications = async (params: {
  page: number;
  size: number;
}): Promise<ApplicationResponse> => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
  });

  return applicationRequest<ApplicationResponse>(`/admin/all?${query}`);
};

export const getAuditLogs = async (params: {
  entityId?: string;
  performedBy?: string;
  action?: string;
  fromDate?: string;
  toDate?: string;
  page: number;
  size: number;
}): Promise<{
  content: AuditLog[];
  totalElements: number;
  totalPages: number;
}> => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
    ...(params.entityId && { entityId: params.entityId }),
    ...(params.performedBy && { performedBy: params.performedBy }),
    ...(params.action && { action: params.action }),
    ...(params.fromDate && { fromDate: params.fromDate }),
    ...(params.toDate && { toDate: params.toDate }),
  });

  return applicationRequest<{
    content: AuditLog[];
    totalElements: number;
    totalPages: number;
  }>(`/admin/audit?${query}`);
};

export const adminExportApplications = async (params: {
  includeDeleted?: boolean;
  fromDate?: string;
  toDate?: string;
  columns?: string[];
}): Promise<ExportResponse> => {
  const query = new URLSearchParams({
    ...(params.includeDeleted && { includeDeleted: "true" }),
    ...(params.fromDate && { fromDate: params.fromDate }),
    ...(params.toDate && { toDate: params.toDate }),
  });

  return applicationRequest<ExportResponse>(`/admin/export?${query}`, {
    method: "POST",
    body: { columns: params.columns },
  });
};

export const getSystemStats = async (): Promise<SystemStats> => {
  return applicationRequest<SystemStats>("/admin/stats");
};

export const adminOverrideApplication = async (
  id: string,
  data: { status?: string; assignedTo?: string; reason: string }
): Promise<Application> => {
  return applicationRequest<Application>(`/admin/${id}/override`, {
    method: "PUT",
    body: data,
  });
};

export const getDeletedApplications = async (params: {
  page: number;
  size: number;
}): Promise<ApplicationResponse> => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
  });

  return applicationRequest<ApplicationResponse>(`/admin/deleted?${query}`);
};

export const restoreApplication = async (id: string): Promise<Application> => {
  return applicationRequest<Application>(`/admin/${id}/restore`, {
    method: "PUT",
  });
};

// =============================================================================
// ANALYTICS & STATS ENDPOINTS (Phase 2)
// =============================================================================

/**
 * Get HR Dashboard Statistics
 * GET /application/hr/dashboard
 */
export const getHRDashboardStats = async (): Promise<DashboardStats> => {
  return applicationRequest<DashboardStats>("/hr/dashboard");
};

/**
 * Get HR Manager Statistics (Company-wide)
 * GET /application/manager/stats
 */
export const getManagerStats = async (
  companyId: string
): Promise<ManagerStats> => {
  return applicationRequest<ManagerStats>(
    `/manager/stats?companyId=${companyId}`
  );
};

/**
 * Get Job-specific Statistics
 * GET /application/job/{jobId}/stats
 */
export const getJobStats = async (jobId: string): Promise<JobStats> => {
  return applicationRequest<JobStats>(`/job/${jobId}/stats`);
};

/**
 * Get Application Count for a Job
 * GET /application/job/{jobId}/count
 */
export const getJobApplicationCount = async (
  jobId: string
): Promise<number> => {
  const response = await applicationRequest<{ count: number }>(
    `/job/${jobId}/count`
  );
  return response.count;
};

/**
 * Search Applications with Advanced Filters
 * GET /application/search
 */
export const searchApplications = async (filters: {
  keyword?: string;
  status?: string[];
  jobIds?: string[];
  companyIds?: string[];
  assignedTo?: string[];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
}): Promise<ApplicationResponse> => {
  const query = new URLSearchParams();

  if (filters.keyword) query.append("keyword", filters.keyword);
  if (filters.status) filters.status.forEach((s) => query.append("status", s));
  if (filters.jobIds) filters.jobIds.forEach((id) => query.append("jobId", id));
  if (filters.companyIds)
    filters.companyIds.forEach((id) => query.append("companyId", id));
  if (filters.assignedTo)
    filters.assignedTo.forEach((u) => query.append("assignedTo", u));
  if (filters.dateFrom) query.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) query.append("dateTo", filters.dateTo);
  query.append("page", (filters.page || 0).toString());
  query.append("size", (filters.size || 20).toString());

  return applicationRequest<ApplicationResponse>(`/search?${query}`);
};

/**
 * Export Applications to CSV or Excel
 * POST /application/export
 */
export const exportApplications = async (request: {
  format: "csv" | "excel";
  companyId?: string;
  jobId?: string;
  status?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
}): Promise<Blob> => {
  const response = await applicationClient.post("/export", request, {
    responseType: "blob",
  });
  return response.data;
};

/**
 * Get Company HR Activities (Audit Log)
 * GET /application/company/{companyId}/hr-activities
 */
export const getHRActivities = async (
  companyId: string,
  page: number = 0,
  size: number = 20
): Promise<HRActivitiesResponse> => {
  const query = new URLSearchParams();
  query.append("page", page.toString());
  query.append("size", size.toString());

  return applicationRequest<HRActivitiesResponse>(
    `/company/${companyId}/hr-activities?${query}`
  );
};
