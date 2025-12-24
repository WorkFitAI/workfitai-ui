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

  // REQUEST INTERCEPTOR: Inject access token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const path = config.url || "";

      // Skip token for public endpoints
      if (isPublicEndpoint(path)) {
        return config;
      }

      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR: Handle 401 with refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Check if 401 and should attempt refresh
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        shouldAttemptRefresh(originalRequest.url || "")
      ) {
        // Check if logged out
        if (getIsLoggedOut()) {
          return Promise.reject(error);
        }

        // If already refreshing, queue this request
        if (getIsRefreshing()) {
          return new Promise((resolve, reject) => {
            addToRefreshQueue(
              (token) => {
                if (token && originalRequest) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(instance(originalRequest));
                } else {
                  reject(error);
                }
              },
              reject
            );
          });
        }

        // Mark as retry to prevent infinite loop
        originalRequest._retry = true;

        try {
          const newToken = await refreshAccessToken();

          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
