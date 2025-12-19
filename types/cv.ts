export interface CVSections {
  skills: string[];
  projects: string[];
  education: string[];
  languages: string[];
  experience: string[];
}

export interface CV {
  cvId: string;
  objectName: string;
  headline: string | null;
  summary: string;
  pdfUrl: string;
  belongTo: string;
  templateType: "UPLOAD" | "TEMPLATE";
  sections: CVSections;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
  exist: boolean;
}

export interface CVPaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface CVListResponse {
  status: number;
  message: string;
  data: {
    meta: CVPaginationMeta;
    result: CV[];
  };
  timestamp: string;
  source: string;
}

export interface CVUploadResponse {
  status: number;
  message: string;
  data: CV;
  source: string;
  timestamp: string;
}

export interface UploadCVRequest {
  file: File;
  templateType: "UPLOAD";
}
