import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import workspaceReducer from "./workspace/workspaceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;