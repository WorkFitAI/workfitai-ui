import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postAuth, AuthTokens, ApiResponse } from "@/lib/authApi";
import { getDeviceId } from "@/lib/deviceId";
import type { RootState } from "@/redux/store";

export const AUTH_STORAGE_KEY = "auth_session";

type RequestStatus = "idle" | "loading";

export interface AuthState {
  accessToken: string | null;
  expiryInMinutes: number | null;
  user: AuthUserProfile | null;
  status: RequestStatus;
  error: string | null;
  message: string | null;
  lastUpdated: number | null;
}

interface AuthUserProfile {
  username?: string;
  fullName?: string;
  role?: string;
  roles?: string[];
  avatarUrl?: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
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

interface AuthResponseData extends AuthTokens {
  username?: string;
  roles?: string[];
}

export interface StoredSession {
  accessToken: string;
  expiryInMinutes: number | null;
  username: string;
  roles: string[];
}

interface AuthSuccess {
  accessToken: string;
  expiryInMinutes: number | null;
  message: string | null;
  user: AuthUserProfile | null;
  tokenType?: string;
  source?: string;
}

const initialState: AuthState = {
  accessToken: null,
  expiryInMinutes: null,
  user: null,
  status: "idle",
  error: null,
  message: null,
  lastUpdated: null,
};
export const initialAuthState = initialState;

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

export const isCompleteStoredSession = (session: unknown): session is StoredSession => {
  if (!session || typeof session !== "object") return false;
  const candidate = session as StoredSession;
  const hasToken = typeof candidate.accessToken === "string" && candidate.accessToken.length > 0;
  // Backend can return null expiry; treat null as valid to avoid re-refreshing on every load.
  const hasExpiry =
    candidate.expiryInMinutes === null ||
    (typeof candidate.expiryInMinutes === "number" && Number.isFinite(candidate.expiryInMinutes));
  const hasUsername = typeof candidate.username === "string" && candidate.username.length > 0;
  const hasRoles =
    Array.isArray(candidate.roles) && candidate.roles.every((role): role is string => typeof role === "string");

  return hasToken && hasExpiry && hasUsername && hasRoles;
};

const toStoredSession = (auth: AuthSuccess): StoredSession => ({
  accessToken: auth.accessToken,
  expiryInMinutes: auth.expiryInMinutes,
  username: auth.user?.username ?? "",
  roles: auth.user?.roles ?? [],
});

export const getUserFromStoredSession = (session: StoredSession): AuthUserProfile | null => {
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

export const buildAuthStateFromStoredSession = (session: StoredSession): AuthState => ({
  ...initialAuthState,
  accessToken: session.accessToken,
  expiryInMinutes: session.expiryInMinutes,
  user: getUserFromStoredSession(session),
  lastUpdated: Date.now(),
});

const normalizeExpiry = (rawExpiry: number | undefined): number | null => {
  if (typeof rawExpiry !== "number" || Number.isNaN(rawExpiry)) {
    return null;
  }

  // Field is named "expiryInMinutes" but backend returns milliseconds; keep raw to stay faithful.
  return rawExpiry;
};

const normalizeUser = (data?: AuthResponseData): AuthUserProfile | null => {
  if (!data) return null;

  const roles = Array.isArray(data.roles)
    ? data.roles.filter((role): role is string => typeof role === "string")
    : undefined;
  const role = roles?.[0];
  const username = data.username;

  if (!username && !role && (!roles || roles.length === 0)) {
    return null;
  }

  return { username, role, roles };
};

const parseAuthResponse = (response: ApiResponse<AuthResponseData>): AuthSuccess => {
  const accessToken = response.data?.accessToken;
  const expiryInMinutes = normalizeExpiry(response.data?.expiryInMinutes);
  const user = normalizeUser(response.data);

  if (!accessToken) {
    throw new Error(response.message || "Missing access token in response");
  }

  return {
    accessToken,
    expiryInMinutes,
    message: response.message ?? null,
    user,
    tokenType: response.tokenType,
    source: response.source,
  };
};

export const registerUser = createAsyncThunk<AuthSuccess, RegisterPayload, { rejectValue: string }>(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postAuth<AuthResponseData>("/register", {
        body: {
          fullName: payload.fullName,
          email: payload.email,
          username: payload.username,
          password: payload.password,
          phoneNumber: payload.phoneNumber,
        },
        deviceId: payload.deviceId ?? getDeviceId(),
      });

      const parsed = parseAuthResponse(response);
      const user = parsed.user ?? { username: payload.username, fullName: payload.fullName };
      // persistSession(toStoredSession({ ...parsed, user }));
      return { ...parsed, user };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unable to register");
    }
  },
);

export const loginUser = createAsyncThunk<AuthSuccess, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postAuth<AuthResponseData>("/login", {
        body: {
          usernameOrEmail: payload.usernameOrEmail,
          password: payload.password,
        },
        deviceId: payload.deviceId ?? getDeviceId(),
      });

      const parsed = parseAuthResponse(response);
      persistSession(toStoredSession(parsed));
      return parsed;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unable to login");
    }
  },
);

export const refreshToken = createAsyncThunk<AuthSuccess, RefreshPayload | undefined, { rejectValue: string }>(
  "auth/refresh",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const response = await postAuth<AuthResponseData>("/refresh", {
        deviceId: payload?.deviceId ?? getDeviceId(),
      });

      const parsed = parseAuthResponse(response);
      const fallbackUser = getState().auth.user;
      persistSession(toStoredSession({ ...parsed, user: parsed.user ?? fallbackUser ?? null }));
      return { ...parsed, user: parsed.user ?? fallbackUser ?? null };
    } catch (error) {
      clearPersistedSession();
      return rejectWithValue(error instanceof Error ? error.message : "Unable to refresh session");
    }
  },
);

export const logoutUser = createAsyncThunk<void, LogoutPayload | undefined, { state: RootState; rejectValue: string }>(
  "auth/logout",
  async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.accessToken;

    if (!token) {
      return rejectWithValue("No access token available");
    }

    try {
      await postAuth<undefined>("/logout", {
        deviceId: payload?.deviceId ?? getDeviceId(),
        accessToken: token,
      });
      persistSession(null);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unable to logout");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreSessionFromStorage: (state, action: PayloadAction<StoredSession | null>) => {
      if (!action.payload) {
        return;
      }
      state.accessToken = action.payload.accessToken;
      state.expiryInMinutes = action.payload.expiryInMinutes;
      state.user = getUserFromStoredSession(action.payload);
      state.message = null;
      state.lastUpdated = Date.now();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.accessToken = action.payload.accessToken;
        state.expiryInMinutes = action.payload.expiryInMinutes;
        state.user = action.payload.user ?? state.user;
        state.error = null;
        state.message = action.payload.message;
        state.lastUpdated = Date.now();
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload ?? "Registration failed";
        state.message = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.accessToken = action.payload.accessToken;
        state.expiryInMinutes = action.payload.expiryInMinutes;
        state.user = action.payload.user ?? null;
        state.error = null;
        state.message = action.payload.message;
        state.lastUpdated = Date.now();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload ?? "Login failed";
        state.message = null;
      })
      .addCase(refreshToken.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.status = "idle";
        state.accessToken = action.payload.accessToken;
        state.expiryInMinutes = action.payload.expiryInMinutes;
        state.user = action.payload.user ?? state.user;
        state.error = null;
        state.message = action.payload.message;
        state.lastUpdated = Date.now();
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = "idle";
        state.accessToken = null;
        state.expiryInMinutes = null;
        state.user = null;
        state.error = action.payload ?? "Refresh token failed";
        state.lastUpdated = Date.now();
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.accessToken = null;
        state.expiryInMinutes = null;
        state.user = null;
        state.message = "Logged out";
        state.lastUpdated = Date.now();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload ?? "Logout failed";
      });
  },
});

export const { restoreSessionFromStorage, clearAuthError } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.auth.accessToken;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthMessage = (state: RootState) => state.auth.message;
export const selectAuthUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
