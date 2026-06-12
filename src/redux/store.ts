import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/auth/authSlice";
import { appointmentApi } from "@/redux/features/appointment/appointmentApi";
import { authApi } from "@/redux/features/auth/authApi";
import { patientDashboardApi } from "@/redux/features/patientDashboard/patientDashboardApi";
import { publicApi } from "@/redux/features/public/publicApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [patientDashboardApi.reducerPath]: patientDashboardApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      appointmentApi.middleware,
      authApi.middleware,
      patientDashboardApi.middleware,
      publicApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
