import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as cvApi from "@/lib/cvApi";
import type { CV, CVPaginationMeta } from "@/types/cv";
import type { RootState } from "@/redux/store";

interface CVState {
  cvs: CV[];
  meta: CVPaginationMeta;
  loading: boolean;
  uploading: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: CVState = {
  cvs: [],
  meta: {
    page: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  },
  loading: false,
  uploading: false,
  deleting: false,
  error: null,
};

// Async thunks
export const uploadCV = createAsyncThunk(
  "cv/upload",
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await cvApi.uploadCV(file);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to upload CV"
      );
    }
  }
);

export const fetchCVList = createAsyncThunk(
  "cv/fetchList",
  async (
    params: {
      username: string;
      page?: number;
      size?: number;
      templateType?: "UPLOAD" | "TEMPLATE";
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await cvApi.getCVList(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch CVs"
      );
    }
  }
);

export const deleteCV = createAsyncThunk(
  "cv/delete",
  async (cvId: string, { rejectWithValue }) => {
    try {
      await cvApi.deleteCV(cvId);
      return cvId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete CV"
      );
    }
  }
);

const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Upload CV
    builder
      .addCase(uploadCV.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadCV.fulfilled, (state, action: PayloadAction<CV>) => {
        state.uploading = false;
        // Add the new CV to the beginning of the list
        state.cvs.unshift(action.payload);
        state.meta.total += 1;
      })
      .addCase(uploadCV.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });

    // Fetch CV list
    builder
      .addCase(fetchCVList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCVList.fulfilled,
        (
          state,
          action: PayloadAction<{ meta: CVPaginationMeta; result: CV[] }>
        ) => {
          state.loading = false;
          state.cvs = action.payload.result;
          state.meta = action.payload.meta;
        }
      )
      .addCase(fetchCVList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete CV
    builder
      .addCase(deleteCV.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteCV.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleting = false;
        // Remove the deleted CV from the list
        state.cvs = state.cvs.filter((cv) => cv.cvId !== action.payload);
        state.meta.total -= 1;
      })
      .addCase(deleteCV.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = cvSlice.actions;

// Selectors
export const selectCVs = (state: RootState): CV[] => state.cv.cvs;
export const selectCVMeta = (state: RootState): CVPaginationMeta =>
  state.cv.meta;
export const selectCVLoading = (state: RootState): boolean => state.cv.loading;
export const selectCVUploading = (state: RootState): boolean =>
  state.cv.uploading;
export const selectCVDeleting = (state: RootState): boolean =>
  state.cv.deleting;
export const selectCVError = (state: RootState): string | null =>
  state.cv.error;

export default cvSlice.reducer;
