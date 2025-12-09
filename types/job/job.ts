import { Company } from '@/types/job/company';

export interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface Job {
    postId: string;
    title: string;
    shortDescription: string;
    employmentType: string;
    experienceLevel: string;
    salaryMin: number;
    salaryMax: number;
    currency: string;
    location: string;
    quantity: number;
    expiresAt: string;
    status: string;
    educationLevel: string;
    company: Company | null;
    skillNames: string[] | null;
}

export interface JobResponse {
    meta: Meta;
    result: Job[];
}
