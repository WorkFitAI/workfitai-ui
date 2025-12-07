import { configureStore, type PreloadedState } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { jobListReducer } from "./features/job/jobListSlice";
import { jobFilterReducer } from "./features/job/jobFilterSlice";

const rootReducer = {
  auth: authReducer,
  jobList: jobListReducer,
  jobFilter: jobFilterReducer,
};

// RootState is explicit so we can type the preloaded state without cycles.
export type RootState = {
  auth: ReturnType<typeof authReducer>;
  jobList: ReturnType<typeof jobListReducer>;
  jobFilter: ReturnType<typeof jobFilterReducer>;
};

export const makeStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];