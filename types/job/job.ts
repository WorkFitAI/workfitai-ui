import { Company } from "@/types/job/company";

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
    skillNames: string[];
    bannerUrl: string | null;
    responsibilities: string;
    requirements: string;
    benefits: string;
    experienceLevel: string;
    requiredExperience: string;
    educationLevel: string;
    expiresAt: string;
    lastModifiedDate: string | null;
}

/* =======================
 * API Response
 * ======================= */
export interface JobResponse {
    meta: Meta;
    result: Job[];
}
