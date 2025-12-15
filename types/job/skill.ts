export interface Skill {
    skillId: string;
    name: string;
}

export interface SkillDataResponse {
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: Skill[];
}

export interface SkillOption {
    label: string;
    value: string;
}