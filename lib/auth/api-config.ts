/**
 * API Base URL Configuration
 */

export const AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:9085/auth";

export const JOB_BASE_URL =
  process.env.NEXT_PUBLIC_JOB_BASE_URL || "http://localhost:9085/job";

export const APPLICATION_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_BASE_URL?.replace("/auth", "/application") ||
  "http://localhost:9085/application";

export const USER_BASE_URL =
  process.env.NEXT_PUBLIC_USER_BASE_URL || "http://localhost:9085/user";

export const NOTIFICATION_BASE_URL =
  process.env.NEXT_PUBLIC_NOTIFICATION_BASE_URL ||
  "http://localhost:9085/notification";

export const CV_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_BASE_URL?.replace("/auth", "/cv") ||
  "http://localhost:9085/cv";

export const MONITORING_BASE_URL =
  process.env.NEXT_PUBLIC_MONITORING_API_URL ||
  "http://localhost:9085/monitoring";
