import { Company } from "@/types/job/company";

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
 * Base Job (dùng chung)
 * ======================= */
export interface JobBase {
    postId: string;
    title: string;
    employmentType: string;
    salaryMin: number;
    salaryMax: number;
    currency: string;
    location: string;
    quantity: number;
}

/* =======================
 * Job dùng cho LIST / SEARCH
 * ======================= */
export interface Job extends JobBase {
    shortDescription: string;
    experienceLevel: string;
    expiresAt: string;
    status: string;
    educationLevel: string;
    company: Company | null;
    skillNames: string[] | null;
}

/* =======================
 * Job chi tiết (DETAIL PAGE)
 * ======================= */
export interface JobDetail extends JobBase {
    createdDate: string;
    company: Company;
    description: string;
    shortDescription: string;
    skillNames: string[];
    bannerUrl: string | null;
    responsibilities: string;
    requirements: string;
    benefits: string;
    experienceLevel: string;
    requiredExperience: string;
    educationLevel: string;
    expiresAt: string;
    status: JobStatus;
    lastModifiedDate: string | null;
}

/* =======================
 * API Response
 * ======================= */
export interface JobResponse {
    meta: Meta;
    result: Job[];
}

export interface ReqUpdateJobDTO {
    jobId: string;
    // Company info
    companyNo?: string;

    location?: string;
    quantity?: number;
    expiresAt?: string;

    // Job basic info
    title?: string;
    description?: string;
    educationLevel?: string;
    experienceLevel?: string;

    shortDescription?: string;

    // Skills
    skillNames?: string[];
    requiredExperience?: string;
    employmentType?: string;

    // Salary
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;

    // Requirements / Preferred experience
    requirements?: string;

    // Responsibilities
    responsibilities?: string;

    // Benefits / What we offer
    benefits?: string;

    // Status
    status?: JobStatus;

    skillIds?: string[];

    // Banner file (if uploading a new one)
    bannerFile?: File;
}


