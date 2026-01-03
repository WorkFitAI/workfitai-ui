/**
 * Axios Client Factory
 *
 * Creates axios instances with request/response interceptors
 * for automatic token injection and 401 handling.
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { isPublicEndpoint, shouldAttemptRefresh } from "@/lib/endpointUtils";
import { getAccessToken, getIsLoggedOut } from "./token-store";
import {
  refreshAccessToken,
  getIsRefreshing,
  addToRefreshQueue,
} from "./refresh-queue";

/**
 * Create an axios instance with interceptors for a specific base URL
 */
export const createApiClient = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    withCredentials: true, // Send cookies
    headers: {
      "Content-Type": "application/json",
    },
  });

  // REQUEST INTERCEPTOR: Check token expiry and inject access token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const path = config.url || "";

      // Skip token for public endpoints
      if (isPublicEndpoint(path)) {
        return config;
      }

      // Check if token is expired BEFORE making the request
      const token = getAccessToken();

      if (!token) {
        // No token available - check if user is logged out
        if (getIsLoggedOut()) {
          // User explicitly logged out - redirect to signin
          if (typeof document !== "undefined") {
            document.location.href = "/signin";
          }
          return Promise.reject(new Error("User is logged out"));
        }
        // Token might have expired - will be handled by response interceptor
      } else {
        // Token exists, add to headers
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR: Handle 401 with refresh and 403 redirect
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 403 Forbidden - redirect to unauthorized page WITHOUT logging out
      // 403 means user is authenticated but lacks permission - don't clear their session
      if (error.response?.status === 403) {
        if (typeof document !== "undefined") {
          document.location.href = "/unauthorized";
        }
        return Promise.reject(error);
      }

      // Check if 401 and should attempt refresh
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        shouldAttemptRefresh(originalRequest.url || "")
      ) {
        // Check if logged out
        if (getIsLoggedOut()) {
          // Redirect to unauthorized page
          if (typeof document !== "undefined") {
            document.location.href = "/unauthorized";
          }
          return Promise.reject(error);
        }

        // If already refreshing, queue this request
        if (getIsRefreshing()) {
          return new Promise((resolve, reject) => {
            addToRefreshQueue((token) => {
              if (token && originalRequest) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(instance(originalRequest));
              } else {
                reject(error);
              }
            }, reject);
          });
        }

        // Mark as retry to prevent infinite loop
        originalRequest._retry = true;

        try {
          const newToken = await refreshAccessToken();

          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          } else {
            // Refresh failed, redirect to signin (user needs to re-authenticate)
            if (typeof document !== "undefined") {
              document.location.href = "/signin";
            }
          }
        } catch (refreshError) {
          // Refresh error, redirect to signin (user needs to re-authenticate)
          if (typeof document !== "undefined") {
            document.location.href = "/signin";
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
