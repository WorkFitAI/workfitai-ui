import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ApplicationStatus } from '@/types/application/application';
import type { RootState } from '@/redux/store';

interface ApplicationFilterState {
  status: ApplicationStatus | null;
  jobIds: string[];
  assignedTo: string | null;
  dateRange: { from: string; to: string } | null;
  searchText: string;
  page: number;
  size: number;
  sortBy: string;
}

const initialState: ApplicationFilterState = {
  status: null,
  jobIds: [],
  assignedTo: null,
  dateRange: null,
  searchText: '',
  page: 0,
  size: 20,
  sortBy: 'submittedAt:desc'
};

const applicationFilterSlice = createSlice({
  name: 'applicationFilter',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<ApplicationStatus | null>) => {
      state.status = action.payload;
      state.page = 0; // Reset page on filter change
    },
    setJobIds: (state, action: PayloadAction<string[]>) => {
      state.jobIds = action.payload;
      state.page = 0;
    },
    setAssignedTo: (state, action: PayloadAction<string | null>) => {
      state.assignedTo = action.payload;
      state.page = 0;
    },
    setDateRange: (state, action: PayloadAction<{ from: string; to: string } | null>) => {
      state.dateRange = action.payload;
      state.page = 0;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
      state.page = 0;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
      state.page = 0;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
      state.page = 0;
    },
    resetFilters: () => initialState
  }
});

export const {
  setStatus,
  setJobIds,
  setAssignedTo,
  setDateRange,
  setSearchText,
  setPage,
  setSize,
  setSortBy,
  resetFilters
} = applicationFilterSlice.actions;

export default applicationFilterSlice.reducer;

// Selectors
export const selectApplicationFilters = (state: RootState): ApplicationFilterState => state.applicationFilter;
export const selectApplicationStatus = (state: RootState): ApplicationStatus | null => state.applicationFilter.status;
export const selectApplicationPage = (state: RootState): number => state.applicationFilter.page;
export const selectApplicationSize = (state: RootState): number => state.applicationFilter.size;
