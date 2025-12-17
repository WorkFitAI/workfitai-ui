import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as applicationApi from '@/lib/applicationApi';
import type {
  Application,
  ApplicationResponse,
  PaginationMeta,
  DashboardStats,
  CreateApplicationRequest,
  UpdateStatusRequest,
  BulkUpdateStatusRequest
} from '@/types/application/application';
import type { RootState } from '@/redux/store';

interface ApplicationState {
  applications: Application[];
  selectedApplication: Application | null;
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
  dashboardStats: DashboardStats | null;
  statsLoading: boolean;
}

const initialState: ApplicationState = {
  applications: [],
  selectedApplication: null,
  meta: {
    page: 0,
    size: 20,
    totalItems: 0,
    totalPages: 0
  },
  loading: false,
  error: null,
  dashboardStats: null,
  statsLoading: false
};

// Async thunks
export const createApplication = createAsyncThunk(
  'application/create',
  async (request: CreateApplicationRequest) => {
    return await applicationApi.createApplication(request);
  }
);

export const fetchMyApplications = createAsyncThunk(
  'application/fetchMy',
  async (params: { page: number; size: number; status?: string }) => {
    return await applicationApi.getMyApplications(params);
  }
);

export const fetchApplicationById = createAsyncThunk(
  'application/fetchById',
  async (id: string) => {
    return await applicationApi.getApplicationById(id);
  }
);

export const fetchApplicationsForJob = createAsyncThunk(
  'application/fetchForJob',
  async (params: { jobId: string; page: number; size: number; status?: string }) => {
    return await applicationApi.getApplicationsForJob(params);
  }
);

export const fetchAssignedApplications = createAsyncThunk(
  'application/fetchAssigned',
  async (params: { page: number; size: number }) => {
    return await applicationApi.getMyAssignedApplications(params);
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'application/updateStatus',
  async ({ id, request }: { id: string; request: UpdateStatusRequest }) => {
    return await applicationApi.updateStatus(id, request);
  }
);

export const bulkUpdateStatus = createAsyncThunk(
  'application/bulkUpdateStatus',
  async (request: BulkUpdateStatusRequest) => {
    return await applicationApi.bulkUpdateStatus(request);
  }
);

export const withdrawApplication = createAsyncThunk(
  'application/withdraw',
  async (id: string) => {
    await applicationApi.withdrawApplication(id);
    return id;
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'application/fetchDashboardStats',
  async () => {
    return await applicationApi.getHRDashboardStats();
  }
);

// Slice
const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    clearSelectedApplication: (state) => {
      state.selectedApplication = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Create application
    builder
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload);
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create application';
      });

    // Fetch my applications
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.items;
        state.meta = action.payload.meta;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch applications';
      });

    // Fetch applications for job
    builder
      .addCase(fetchApplicationsForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationsForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.items;
        state.meta = action.payload.meta;
      })
      .addCase(fetchApplicationsForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch applications';
      });

    // Fetch assigned applications
    builder
      .addCase(fetchAssignedApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.items;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAssignedApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch assigned applications';
      });

    // Fetch by ID
    builder
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch application';
      });

    // Update status
    builder
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        if (state.selectedApplication?.id === action.payload.id) {
          state.selectedApplication = action.payload;
        }
      });

    // Withdraw
    builder
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(app => app.id !== action.payload);
        if (state.selectedApplication?.id === action.payload) {
          state.selectedApplication = null;
        }
      });

    // Dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state) => {
        state.statsLoading = false;
      });
  }
});

export const { clearSelectedApplication, clearError } = applicationSlice.actions;
export default applicationSlice.reducer;

// Selectors
export const selectApplications = (state: RootState): Application[] => state.application.applications;
export const selectSelectedApplication = (state: RootState): Application | null => state.application.selectedApplication;
export const selectApplicationMeta = (state: RootState): PaginationMeta => state.application.meta;
export const selectApplicationLoading = (state: RootState): boolean => state.application.loading;
export const selectApplicationError = (state: RootState): string | null => state.application.error;
export const selectDashboardStats = (state: RootState): DashboardStats | null => state.application.dashboardStats;
