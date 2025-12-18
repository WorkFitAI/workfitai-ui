import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import {
  postAuth,
  authRequest,
  ApiResponse,
  UnauthorizedError,
  ForbiddenError,
} from "@/lib/authApi";
import { getDeviceId } from "@/lib/deviceId";
import { resetRefreshState } from "@/lib/tokenRefreshHandler";
import type { RootState } from "@/redux/store";

export const AUTH_STORAGE_KEY = "auth_session";

type RequestStatus = "idle" | "loading";

// Error types for navigation handling
export type AuthErrorType = "unauthorized" | "forbidden" | "generic" | null;

export interface AuthState {
  accessToken: string | null;
  expiryTime: number | null; // Absolute timestamp when token expires (ms)
  user: AuthUserProfile | null;
  status: RequestStatus;
  error: string | null;
  errorType: AuthErrorType;
  message: string | null;
  // Role-specific state
  pendingApproval: boolean;
  approvalType: "hr-manager" | "admin" | null;
  registrationRole: "CANDIDATE" | "HR" | "HR_MANAGER" | null;
  userId: string | null; // For OTP verification after registration
}

interface AuthUserProfile {
  username?: string;
  email?: string;
  fullName?: string;
  role?: string;
  roles?: string[];
  avatarUrl?: string;
  // Role-specific data
  companyId?: string;
  companyName?: string;
  department?: string;
  isApproved?: boolean;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  deviceId?: string;
  role?: "CANDIDATE" | "HR" | "HR_MANAGER";

  // HR & HR_MANAGER specific
  hrProfile?: {
    department: string;
    hrManagerEmail?: string; // Required for HR only
    address: string;
  };

  // HR_MANAGER specific
  company?: {
    name: string;
    logoUrl?: string;
    websiteUrl?: string;
    description?: string;
    address: string;
    size?: string;
  };
}

interface OTPPayload {
  email: string;
  otp: string;
  deviceId?: string;
}

interface ResendOTPPayload {
  email: string;
  deviceId?: string;
}

interface LoginPayload {
  usernameOrEmail: string;
  password: string;
  deviceId?: string;
}

interface RefreshPayload {
  deviceId?: string;
}

interface LogoutPayload {
  deviceId?: string;
}

interface AuthResponseData {
  accessToken: string;
  expiryInMinutes: number;
  username: string;
  roles: string[];
}

export interface StoredSession {
  accessToken: string;
  expiryTime: number | null; // Absolute timestamp (ms)
  username: string;
  roles: string[];
}

interface AuthSuccess {
  accessToken: string;
  expiryTime: number | null; // Absolute timestamp (ms)
  message: string | null;
  user: AuthUserProfile | null;
  tokenType?: string;
  source?: string;
}

const initialAuthState: AuthState = {
  accessToken: null,
  expiryTime: null,
  user: null,
  status: "idle",
  error: null,
  errorType: null,
  message: null,
  pendingApproval: false,
  approvalType: null,
  registrationRole: null,
  userId: null,
};

// Helper to determine error type from caught error
const getErrorType = (error: unknown): AuthErrorType => {
  if (error instanceof UnauthorizedError) return "unauthorized";
  if (error instanceof ForbiddenError) return "forbidden";
  return "generic";
};

const persistSession = (session: StoredSession | null) => {
  if (typeof window === "undefined") return;

  if (!session) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

const clearRefreshTokenCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = "RT=; path=/; max-age=0";
  document.cookie = "RT=; path=/auth; max-age=0";
};

const clearPersistedSession = () => {
  persistSession(null);
  clearRefreshTokenCookie();
};

export const isCompleteStoredSession = (
  session: unknown
): session is StoredSession => {
  if (!session || typeof session !== "object") return false;
  const candidate = session as StoredSession;
  const hasToken =
    typeof candidate.accessToken === "string" &&
    candidate.accessToken.length > 0;
  // Backend can return null expiry; treat null as valid (never expires)
  const hasExpiry =
    candidate.expiryTime === null ||
    (typeof candidate.expiryTime === "number" &&
      Number.isFinite(candidate.expiryTime));
  const hasUsername =
    typeof candidate.username === "string" && candidate.username.length > 0;
  const hasRoles =
    Array.isArray(candidate.roles) &&
    candidate.roles.every((role): role is string => typeof role === "string");

  return hasToken && hasExpiry && hasUsername && hasRoles;
};

const toStoredSession = (auth: AuthSuccess): StoredSession => ({
  accessToken: auth.accessToken,
  expiryTime: auth.expiryTime,
  username: auth.user?.username ?? "",
  roles: auth.user?.roles ?? [],
});

export const getUserFromStoredSession = (
  session: StoredSession
): AuthUserProfile | null => {
  if (!session.username) return null;

  const roles = Array.isArray(session.roles)
    ? session.roles.filter((role): role is string => typeof role === "string")
    : [];
  const role = roles[0];

  return {
    username: session.username,
    roles,
    role,
  };
};

export const buildAuthStateFromStoredSession = (
  session: StoredSession
): AuthState => ({
  ...initialAuthState,
  accessToken: session.accessToken,
  expiryTime: session.expiryTime,
  user: getUserFromStoredSession(session),
});

/**
 * Convert expiryInMinutes to absolute timestamp
 * Returns null if no expiry (never expires)
 */
const calculateExpiryTime = (expiryInMinutes: number | undefined): number | null => {
  if (
    expiryInMinutes === undefined ||
    typeof expiryInMinutes !== "number" ||
    Number.isNaN(expiryInMinutes) ||
    expiryInMinutes <= 0
  ) {
    return null; // No expiry or invalid
  }
  // Convert minutes to absolute timestamp
  return Date.now() + (expiryInMinutes * 60 * 1000);
};

const normalizeUser = (data?: AuthResponseData): AuthUserProfile | null => {
  if (!data || !data.username) return null;

  const username = data.username;
  const roles = data.roles;

  // Derive role from roles array
  let role: string | undefined = undefined;
  if (roles.includes("ROLE_CANDIDATE")) role = "CANDIDATE";
  else if (roles.includes("ROLE_HR")) role = "HR";
  else if (roles.includes("ROLE_HR_MANAGER")) role = "HR_MANAGER";
  else if (roles.includes("ROLE_ADMIN")) role = "ADMIN";

  return { username, role, roles };
};

const parseAuthResponse = (
  response: ApiResponse<AuthResponseData>
): AuthSuccess => {
  if (!response.data) {
    throw new Error(response.message || "Missing response data");
  }

  const { accessToken, expiryInMinutes } = response.data;
  const user = normalizeUser(response.data);

  if (!accessToken) {
    throw new Error(response.message || "Missing access token in response");
  }

  return {
    accessToken,
    expiryTime: calculateExpiryTime(expiryInMinutes),
    message: response.message ?? null,
    user,
    tokenType: response.tokenType,
    source: response.source,
  };
};

// Rejection payload with error type information
interface AuthRejectPayload {
  message: string;
  errorType: AuthErrorType;
}

export const registerUser = createAsyncThunk<
  {
    userId: string;
    message: string;
    user: AuthUserProfile;
    role?: "CANDIDATE" | "HR" | "HR_MANAGER";
  },
  RegisterPayload,
  { rejectValue: AuthRejectPayload }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const response = await postAuth<string>("/register", {
      body: {
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
        phoneNumber: payload.phoneNumber,
        role: payload.role,
        hrProfile: payload.hrProfile,
        company: payload.company,
      },
      deviceId: payload.deviceId ?? getDeviceId(),
    });

    const username = payload.email.split("@")[0];

    // Registration returns userId as string in data field for OTP verification
    return {
      userId: response.data ?? "",
      message:
        response.message ?? "OTP has been sent to your email for verification",
      user: {
        username: username,
        fullName: payload.fullName,
      },
      role: payload.role, // Pass role to fulfilled action to update state
    };
  } catch (error) {
    return rejectWithValue({
      message: error instanceof Error ? error.message : "Unable to register",
      errorType: getErrorType(error),
    });
  }
});

export const verifyOTP = createAsyncThunk<
  {
    success: boolean;
    pendingApproval: boolean;
    approvalType?: "hr-manager" | "admin";
    message?: string;
  },
  OTPPayload,
  { rejectValue: AuthRejectPayload }
>("auth/verifyOTP", async (payload, { rejectWithValue }) => {
  try {
    const response = await postAuth<{
      success: boolean;
      pendingApproval: boolean;
      approvalType?: "hr-manager" | "admin";
    }>("/verify-otp", {
      body: {
        email: payload.email,
        otp: payload.otp,
      },
      deviceId: payload.deviceId ?? getDeviceId(),
    });

    return {
      success: response.data?.success ?? true,
      pendingApproval: response.data?.pendingApproval ?? false,
      approvalType: response.data?.approvalType,
      message: response.message,
    };
  } catch (error) {
    return rejectWithValue({
      message:
        error instanceof Error ? error.message : "OTP verification failed",
      errorType: getErrorType(error),
    });
  }
});

export const resendOTP = createAsyncThunk<
  { message: string },
  ResendOTPPayload,
  { rejectValue: AuthRejectPayload }
>("auth/resendOTP", async (payload, { rejectWithValue }) => {
  try {
    const response = await postAuth<undefined>("/resend-otp", {
      body: {
        email: payload.email,
      },
      deviceId: payload.deviceId ?? getDeviceId(),
    });

    return {
      message: response.message ?? "OTP resent successfully",
    };
  } catch (error) {
    return rejectWithValue({
      message: error instanceof Error ? error.message : "Failed to resend OTP",
      errorType: getErrorType(error),
    });
  }
});

export const checkApprovalStatus = createAsyncThunk<
  { isApproved: boolean; companyId?: string },
  string,
  { rejectValue: AuthRejectPayload }
>("auth/checkApprovalStatus", async (userId, { rejectWithValue }) => {
  try {
    const response = await authRequest<{
      isApproved: boolean;
      companyId?: string;
    }>(`/approval-status/${userId}`, {
      deviceId: getDeviceId(),
    });

    return {
      isApproved: response.data?.isApproved ?? false,
      companyId: response.data?.companyId,
    };
  } catch (error) {
    return rejectWithValue({
      message:
        error instanceof Error
          ? error.message
          : "Failed to check approval status",
      errorType: getErrorType(error),
    });
  }
});

export const loginUser = createAsyncThunk<
  AuthSuccess | { require2FA: true; tempToken: string; method: 'TOTP' | 'EMAIL'; message: string },
  LoginPayload,
  { rejectValue: AuthRejectPayload }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const response = await postAuth<any>("/login", {
      body: {
        usernameOrEmail: payload.usernameOrEmail,
        password: payload.password,
      },
      deviceId: payload.deviceId ?? getDeviceId(),
    });

    // Check if 2FA is required - backend returns { data: { require2FA, tempToken, method } }
    if (response.data?.require2FA === true || response.data?.tempToken) {
      return {
        require2FA: true,
        tempToken: response.data.tempToken,
        method: response.data.method,
        message: response.data.message || response.message || "2FA verification required",
      };
    }

    // Normal login
    const parsed = parseAuthResponse(response);
    persistSession(toStoredSession(parsed));
    return parsed;
  } catch (error) {
    return rejectWithValue({
      message: error instanceof Error ? error.message : "Unable to login",
      errorType: getErrorType(error),
    });
  }
});

export const refreshToken = createAsyncThunk<
  AuthSuccess,
  RefreshPayload | undefined,
  { state: RootState; rejectValue: AuthRejectPayload }
>("auth/refresh", async (payload, { rejectWithValue, getState }) => {
  try {
    const response = await postAuth<AuthResponseData>("/refresh", {
      deviceId: payload?.deviceId ?? getDeviceId(),
    });

    const parsed = parseAuthResponse(response);
    const fallbackUser = getState().auth.user;
    persistSession(
      toStoredSession({ ...parsed, user: parsed.user ?? fallbackUser ?? null })
    );
    return { ...parsed, user: parsed.user ?? fallbackUser ?? null };
  } catch (error) {
    clearPersistedSession();
    return rejectWithValue({
      message:
        error instanceof Error ? error.message : "Unable to refresh session",
      errorType: getErrorType(error),
    });
  }
});

export const logoutUser = createAsyncThunk<
  void,
  LogoutPayload | undefined,
  { state: RootState; rejectValue: string }
>("auth/logout", async (payload, { getState }) => {
  const state = getState();
  const token = state.auth.accessToken;
  const deviceId = payload?.deviceId ?? getDeviceId();

  // Always clear local session regardless of API response
  // This ensures UI logout works even if server returns 401 (token already invalid)
  clearPersistedSession();

  // Clear token refresh state to prevent pending refresh requests
  resetRefreshState();

  if (!token) {
    // No token but still consider logout successful since session is cleared
    return;
  }

  try {
    await postAuth<undefined>("/logout", {
      deviceId,
      accessToken: token,
    });
  } catch (error) {
    // Don't reject on 401 - the token is already invalid, logout is effectively done
    // For other errors, we still cleared the local session so UI logout succeeds
    console.warn("Logout API call failed:", error);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    restoreSessionFromStorage: (
      state,
      action: PayloadAction<StoredSession | null>
    ) => {
      if (!action.payload) {
        return;
      }
      state.accessToken = action.payload.accessToken;
      state.expiryTime = action.payload.expiryTime;
      state.user = getUserFromStoredSession(action.payload);
      state.message = null;
    },
    clearAuthError: (state) => {
      state.error = null;
      state.errorType = null;
    },
    updateUserAvatar: (state, action: PayloadAction<string | null>) => {
      if (state.user) {
        state.user.avatarUrl = action.payload ?? undefined;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorType = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.userId = action.payload.userId; // Store userId for OTP verification redirect
        state.user = action.payload.user;
        state.registrationRole = action.payload.role || "CANDIDATE";
        state.error = null;
        state.errorType = null;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload?.message ?? "Registration failed";
        state.errorType = action.payload?.errorType ?? "generic";
        state.message = null;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorType = null;
        state.message = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.status = "idle";
        state.pendingApproval = action.payload.pendingApproval;
        state.approvalType = action.payload.approvalType ?? null;
        state.error = null;
        state.errorType = null;
        state.message = action.payload.message ?? "OTP verified successfully";
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload?.message ?? "OTP verification failed";
        state.errorType = action.payload?.errorType ?? "generic";
        state.message = null;
      })
      .addCase(resendOTP.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorType = null;
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.errorType = null;
        state.message = action.payload.message;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload?.message ?? "Failed to resend OTP";
        state.errorType = action.payload?.errorType ?? "generic";
      })
      .addCase(checkApprovalStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkApprovalStatus.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload.isApproved) {
          state.pendingApproval = false;
          state.approvalType = null;
        }
      })
      .addCase(checkApprovalStatus.rejected, (state, action) => {
        state.status = "idle";
        state.error =
          action.payload?.message ?? "Failed to check approval status";
        state.errorType = action.payload?.errorType ?? "generic";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorType = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "idle";
        // Only update state for normal login (not 2FA)
        if (!('require2FA' in action.payload)) {
          state.accessToken = action.payload.accessToken;
          state.expiryTime = action.payload.expiryTime;
          state.user = action.payload.user ?? null;
          state.message = action.payload.message;
        } else {
          // For 2FA, just show the message
          state.message = action.payload.message;
        }
        state.error = null;
        state.errorType = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload?.message ?? "Login failed";
        state.errorType = action.payload?.errorType ?? "generic";
        state.message = null;
      })
      .addCase(refreshToken.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorType = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.status = "idle";
        state.accessToken = action.payload.accessToken;
        state.expiryTime = action.payload.expiryTime;
        state.user = action.payload.user ?? state.user;
        state.error = null;
        state.errorType = null;
        state.message = action.payload.message;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = "idle";
        state.accessToken = null;
        state.expiryTime = null;
        state.user = null;
        state.error = action.payload?.message ?? "Refresh token failed";
        state.errorType = action.payload?.errorType ?? "generic";
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorType = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.accessToken = null;
        state.expiryTime = null;
        state.user = null;
        state.error = null;
        state.errorType = null;
        state.message = "Logged out";
      });
  },
});

export const { restoreSessionFromStorage, clearAuthError, updateUserAvatar } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.auth.accessToken;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthErrorType = (state: RootState) => state.auth.errorType;
export const selectAuthMessage = (state: RootState) => state.auth.message;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectPendingApproval = (state: RootState) =>
  state.auth.pendingApproval;
export const selectApprovalType = (state: RootState) => state.auth.approvalType;
export const selectUserRole = (state: RootState) => state.auth.user?.role;

// Memoized selector to prevent unnecessary rerenders when roles array doesn't change
const EMPTY_ROLES: string[] = [];
export const selectUserRoles = createSelector(
  [(state: RootState) => state.auth.user?.roles],
  (roles) => roles ?? EMPTY_ROLES
);

export const selectUserId = (state: RootState) => state.auth.userId;
export const selectRegistrationRole = (state: RootState) =>
  state.auth.registrationRole;

/**
 * Simple selector to check if token is valid
 * Just checks if token exists and hasn't expired
 * FAST: No calculations, just timestamp comparison
 */
export const selectIsTokenValid = (state: RootState): boolean => {
  const { accessToken, expiryTime } = state.auth;

  if (!accessToken) return false;

  // If no expiry time, token never expires
  if (expiryTime === null) return true;

  // Simple comparison: is expiry time in the future?
  return expiryTime > Date.now();
};

/**
 * Get token expiry time (absolute timestamp)
 */
export const selectTokenExpiryTime = (state: RootState) => state.auth.expiryTime;

export default authSlice.reducer;
