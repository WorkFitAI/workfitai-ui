import { Company } from "@/types/job/company";

/* =======================
 * ENUMS
 * ======================= */
export type JobStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

/* =======================
 * Pagination Meta
 * ======================= */
export interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

/* =======================
 * CORE JOB FIELDS
 * ======================= */
export interface JobCoreFields {
    title: string;
    shortDescription: string;
    description: string;

    employmentType: string;
    experienceLevel: string;
    requiredExperience: string;
    educationLevel: string;

    salaryMin: number;
    salaryMax: number;
    currency: string;

    location: string;
    quantity: number;
    expiresAt: string;
    status?: JobStatus;
}

/* =======================
 * OPTIONAL CONTENT
 * ======================= */
export interface JobContentFields {
    benefits?: string;
    requirements?: string;
    responsibilities?: string;
}

/* =======================
 * RELATIONS
 * ======================= */
export interface JobRelationFields {
    companyNo: string;
    skillIds: string[];
}

/* =======================
 * BASE JOB (ENTITY)
 * ======================= */
export interface JobBase extends JobCoreFields {
    postId: string;
    status: JobStatus;
}

/* =======================
 * JOB LIST / SEARCH
 * ======================= */
export interface Job extends JobBase {
    company: Company | null;
    skillNames: string[] | null;
}

/* =======================
 * JOB DETAIL
 * ======================= */
export interface JobDetail
    extends JobBase,
    JobContentFields {
    createdDate: string;
    lastModifiedDate: string | null;

    company: Company;
    skillNames: string[];

    bannerUrl: string | null;
}

/* =======================
 * CREATE JOB - FORM STATE
 * ======================= */
export interface PostJobForm
    extends Omit<
        JobCoreFields,
        "salaryMin" | "salaryMax" | "expiresAt"
    >,
    JobContentFields,
    JobRelationFields {
    salaryMin: string;
    salaryMax: string;
    expiresAt: string;
}

/* =======================
 * CREATE JOB - API PAYLOAD
 * ======================= */
export interface PostJobData
    extends JobCoreFields,
    JobContentFields,
    JobRelationFields { }

/* =======================
 * UPDATE JOB
 * ======================= */
export interface ReqUpdateJobDTO
    extends Partial<PostJobData> {
    jobId: string;
    status?: JobStatus;
    bannerFile?: File;
}

/* =======================
 * JOB RECOMMENDATION
 * ======================= */
export interface RecommendationJob {
    job: Job;
    score: number;
    rank: number;
}

export interface RecommendationResponse {
    recommendations: RecommendationJob[];
    totalResults: number;
    processingTime: string;
}

/* =======================
 * JOB LIST RESPONSE
 * ======================= */
export interface JobResponse {
    meta: Meta;
    result: Job[];
}
