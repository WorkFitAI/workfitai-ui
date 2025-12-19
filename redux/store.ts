import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { jobListReducer } from "./features/job/jobListSlice";
import { jobFilterReducer } from "./features/job/jobFilterSlice";
import applicationReducer from "./features/application/applicationSlice";
import applicationFilterReducer from "./features/application/applicationFilterSlice";
import profileReducer from "./features/profile/profileSlice";
import cvReducer from "./features/cv/cvSlice";

const rootReducer = {
  auth: authReducer,
  jobList: jobListReducer,
  jobFilter: jobFilterReducer,
  application: applicationReducer,
  applicationFilter: applicationFilterReducer,
  profile: profileReducer,
  cv: cvReducer,
};

// Create a temp store to infer the state type
const tempStore = configureStore({ reducer: rootReducer });
export type RootState = ReturnType<typeof tempStore.getState>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
