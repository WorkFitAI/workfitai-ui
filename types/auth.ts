// Auth-related TypeScript interfaces

export type UserRole = "CANDIDATE" | "HR" | "HR_MANAGER" | "ADMIN";

export interface RegisterPayload {
  fullName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
  role?: UserRole;
  companyName?: string;
  companySize?: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface OTPPayload {
  userId: string;
  otp: string;
}

export interface ResendOTPPayload {
  userId: string;
}

export interface RegisterResponse {
  userId: string;
  message: string;
}

export interface OTPResponse {
  success: boolean;
  pendingApproval: boolean;
  approvalType?: "hr-manager" | "admin";
  message?: string;
}

export interface ResendOTPResponse {
  message: string;
}

export interface ApprovalStatusResponse {
  isApproved: boolean;
  companyId?: string;
}

export interface LoginResponse {
  accessToken: string;
  expiryInMinutes: number;
  username: string;
  roles: string[];
  companyId?: string;
}
