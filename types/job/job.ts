import { Company } from '@/types/job/company';
import { Skill } from '@/types/job/skill';

export interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface Job {
    postId: string;
    title: string;
    description: string;
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
    skills: Skill[] | null;
}

export interface JobResponse {
    meta: Meta;
    result: Job[];
}
