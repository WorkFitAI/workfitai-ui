import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import type {
    UserProfile,
    AvatarUploadResponse,
    UpdateProfileRequest,
    DeactivateAccountRequest,
    DeleteAccountRequest,
} from "@/types/profile";
import type {
    NotificationSettings,
    PrivacySettings,
    ChangePasswordRequest,
    Enable2FARequest,
    Disable2FARequest,
    RegenerateBackupCodesRequest,
    SessionInfo,
} from "@/types/settings";
import * as profileApi from "@/lib/profileApi";

// State type
export interface ProfileState {
    profile: UserProfile | null;
    notificationSettings: NotificationSettings | null;
    privacySettings: PrivacySettings | null;
    sessions: {
        current: SessionInfo | null;
        others: SessionInfo[];
    };

    // Loading states
    loading: boolean;
    uploadingAvatar: boolean;
    savingSettings: boolean;
    changingPassword: boolean;
    managing2FA: boolean;

    // Error states
    error: string | null;

    // Success messages
    successMessage: string | null;
}

const initialState: ProfileState = {
    profile: null,
    notificationSettings: null,
    privacySettings: null,
    sessions: {
        current: null,
        others: [],
    },

    loading: false,
    uploadingAvatar: false,
    savingSettings: false,
    changingPassword: false,
    managing2FA: false,

    error: null,
    successMessage: null,
};

// =============================================================================
// ASYNC THUNKS - PROFILE
// =============================================================================

export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.getCurrentProfile();
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to fetch profile");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch profile");
        }
    }
);

export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (data: UpdateProfileRequest, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateProfile(data);
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to update profile");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update profile");
        }
    }
);

export const uploadAvatar = createAsyncThunk(
    "profile/uploadAvatar",
    async (file: File, { rejectWithValue }) => {
        try {
            const response = await profileApi.uploadAvatar(file);
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to upload avatar");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to upload avatar");
        }
    }
);

export const deleteAvatar = createAsyncThunk(
    "profile/deleteAvatar",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.deleteAvatar();
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to delete avatar");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to delete avatar");
        }
    }
);

export const deactivateAccount = createAsyncThunk(
    "profile/deactivateAccount",
    async (data: DeactivateAccountRequest, { rejectWithValue }) => {
        try {
            const response = await profileApi.deactivateAccount(data);
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to deactivate account");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to deactivate account");
        }
    }
);

export const requestAccountDeletion = createAsyncThunk(
    "profile/requestAccountDeletion",
    async (data: DeleteAccountRequest, { rejectWithValue }) => {
        try {
            const response = await profileApi.requestAccountDeletion(data);
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to request account deletion");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to request account deletion");
        }
    }
);

// =============================================================================
// ASYNC THUNKS - NOTIFICATION SETTINGS
// =============================================================================

export const fetchNotificationSettings = createAsyncThunk(
    "profile/fetchNotificationSettings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.getNotificationSettings();
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to fetch notification settings");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch notification settings");
        }
    }
);

export const updateNotificationSettings = createAsyncThunk(
    "profile/updateNotificationSettings",
    async (settings: NotificationSettings, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateNotificationSettings(settings);
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to update notification settings");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update notification settings");
        }
    }
);

// =============================================================================
// ASYNC THUNKS - PRIVACY SETTINGS
// =============================================================================

export const fetchPrivacySettings = createAsyncThunk(
    "profile/fetchPrivacySettings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.getPrivacySettings();
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to fetch privacy settings");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch privacy settings");
        }
    }
);

export const updatePrivacySettings = createAsyncThunk(
    "profile/updatePrivacySettings",
    async (settings: PrivacySettings, { rejectWithValue }) => {
        try {
            const response = await profileApi.updatePrivacySettings(settings);
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to update privacy settings");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update privacy settings");
        }
    }
);

// =============================================================================
// ASYNC THUNKS - SECURITY
// =============================================================================

export const changePassword = createAsyncThunk(
    "profile/changePassword",
    async (data: ChangePasswordRequest, { rejectWithValue }) => {
        try {
            const response = await profileApi.changePassword(data);
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to change password");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to change password");
        }
    }
);

export const enable2FA = createAsyncThunk(
    "profile/enable2FA",
    async (data: Enable2FARequest, { rejectWithValue }) => {
        try {
            const response = await profileApi.enable2FA(data);
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to enable 2FA");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to enable 2FA");
        }
    }
);

export const disable2FA = createAsyncThunk(
    "profile/disable2FA",
    async (data: Disable2FARequest, { rejectWithValue }) => {
        try {
            const response = await profileApi.disable2FA(data);
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to disable 2FA");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to disable 2FA");
        }
    }
);

export const regenerateBackupCodes = createAsyncThunk(
    "profile/regenerateBackupCodes",
    async (data: RegenerateBackupCodesRequest, { rejectWithValue }) => {
        try {
            const response = await profileApi.regenerateBackupCodes(data);
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to regenerate backup codes");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to regenerate backup codes");
        }
    }
);

export const fetchActiveSessions = createAsyncThunk(
    "profile/fetchActiveSessions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.getActiveSessions();
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to fetch active sessions");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch active sessions");
        }
    }
);

export const logoutSession = createAsyncThunk(
    "profile/logoutSession",
    async (sessionId: string, { rejectWithValue }) => {
        try {
            const response = await profileApi.logoutSession(sessionId);
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to logout session");
            }
            return sessionId;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to logout session");
        }
    }
);

export const logoutAllOtherSessions = createAsyncThunk(
    "profile/logoutAllOtherSessions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.logoutAllOtherSessions();
            if (response.status === "error") {
                return rejectWithValue(response.message || "Failed to logout all sessions");
            }
            return response.data!;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to logout all sessions");
        }
    }
);

// =============================================================================
// SLICE
// =============================================================================

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        resetProfileState: () => initialState,
    },
    extraReducers: (builder) => {
        // Fetch Profile
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update Profile
        builder
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.successMessage = "Profile updated successfully";
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Upload Avatar
        builder
            .addCase(uploadAvatar.pending, (state) => {
                state.uploadingAvatar = true;
                state.error = null;
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.uploadingAvatar = false;
                if (state.profile) {
                    state.profile.avatarUrl = action.payload.avatarUrl;
                }
                state.successMessage = "Avatar uploaded successfully";
            })
            .addCase(uploadAvatar.rejected, (state, action) => {
                state.uploadingAvatar = false;
                state.error = action.payload as string;
            });

        // Delete Avatar
        builder
            .addCase(deleteAvatar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAvatar.fulfilled, (state) => {
                state.loading = false;
                if (state.profile) {
                    state.profile.avatarUrl = null;
                }
                state.successMessage = "Avatar deleted successfully";
            })
            .addCase(deleteAvatar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Notification Settings
        builder
            .addCase(fetchNotificationSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.notificationSettings = action.payload;
            })
            .addCase(fetchNotificationSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(updateNotificationSettings.pending, (state) => {
                state.savingSettings = true;
                state.error = null;
            })
            .addCase(updateNotificationSettings.fulfilled, (state, action) => {
                state.savingSettings = false;
                state.notificationSettings = action.payload;
                state.successMessage = "Notification settings updated";
            })
            .addCase(updateNotificationSettings.rejected, (state, action) => {
                state.savingSettings = false;
                state.error = action.payload as string;
            });

        // Privacy Settings
        builder
            .addCase(fetchPrivacySettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPrivacySettings.fulfilled, (state, action) => {
                state.loading = false;
                state.privacySettings = action.payload;
            })
            .addCase(fetchPrivacySettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(updatePrivacySettings.pending, (state) => {
                state.savingSettings = true;
                state.error = null;
            })
            .addCase(updatePrivacySettings.fulfilled, (state, action) => {
                state.savingSettings = false;
                state.privacySettings = action.payload;
                state.successMessage = "Privacy settings updated";
            })
            .addCase(updatePrivacySettings.rejected, (state, action) => {
                state.savingSettings = false;
                state.error = action.payload as string;
            });

        // Change Password
        builder
            .addCase(changePassword.pending, (state) => {
                state.changingPassword = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.changingPassword = false;
                state.successMessage = "Password changed successfully. Other sessions have been logged out.";
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.changingPassword = false;
                state.error = action.payload as string;
            });

        // 2FA
        builder
            .addCase(enable2FA.pending, (state) => {
                state.managing2FA = true;
                state.error = null;
            })
            .addCase(enable2FA.fulfilled, (state) => {
                state.managing2FA = false;
                state.successMessage = "2FA enabled successfully";
            })
            .addCase(enable2FA.rejected, (state, action) => {
                state.managing2FA = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(disable2FA.pending, (state) => {
                state.managing2FA = true;
                state.error = null;
            })
            .addCase(disable2FA.fulfilled, (state) => {
                state.managing2FA = false;
                state.successMessage = "2FA disabled successfully";
            })
            .addCase(disable2FA.rejected, (state, action) => {
                state.managing2FA = false;
                state.error = action.payload as string;
            });

        // Active Sessions
        builder
            .addCase(fetchActiveSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.sessions.current = action.payload.current;
                state.sessions.others = action.payload.others;
            })
            .addCase(fetchActiveSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(logoutSession.fulfilled, (state, action) => {
                state.sessions.others = state.sessions.others.filter(
                    (session) => session.sessionId !== action.payload
                );
                state.successMessage = "Session logged out successfully";
            })
            .addCase(logoutSession.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        builder
            .addCase(logoutAllOtherSessions.fulfilled, (state) => {
                state.sessions.others = [];
                state.successMessage = "All other sessions logged out successfully";
            })
            .addCase(logoutAllOtherSessions.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

// =============================================================================
// EXPORTS
// =============================================================================

export const { clearError, clearSuccessMessage, resetProfileState } = profileSlice.actions;

export default profileSlice.reducer;

// Selectors
export const selectProfile = (state: RootState) => state.profile.profile;
export const selectNotificationSettings = (state: RootState) =>
    state.profile.notificationSettings;
export const selectPrivacySettings = (state: RootState) => state.profile.privacySettings;
export const selectSessions = (state: RootState) => state.profile.sessions;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
export const selectUploadingAvatar = (state: RootState) => state.profile.uploadingAvatar;
export const selectSavingSettings = (state: RootState) => state.profile.savingSettings;
export const selectProfileError = (state: RootState) => state.profile.error;
export const selectProfileSuccessMessage = (state: RootState) => state.profile.successMessage;
