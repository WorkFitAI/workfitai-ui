import { configureStore, type PreloadedState } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";

const rootReducer = {
  auth: authReducer,
};

// RootState is explicit so we can type the preloaded state without cycles.
export type RootState = {
  auth: ReturnType<typeof authReducer>;
};

export const makeStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];