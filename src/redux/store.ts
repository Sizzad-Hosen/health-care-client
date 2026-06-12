import { configureStore } from "@reduxjs/toolkit";
import { adminDashboardApi } from "@/redux/features/adminDashboard/adminDashboardApi";
import authReducer from "@/redux/features/auth/authSlice";
import { appointmentApi } from "@/redux/features/appointment/appointmentApi";
import { authApi } from "@/redux/features/auth/authApi";
import { doctorDashboardApi } from "@/redux/features/doctorDashboard/doctorDashboardApi";
import { patientDashboardApi } from "@/redux/features/patientDashboard/patientDashboardApi";
import { publicApi } from "@/redux/features/public/publicApi";
import { reviewApi } from "@/redux/features/review/reviewApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [adminDashboardApi.reducerPath]: adminDashboardApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [doctorDashboardApi.reducerPath]: doctorDashboardApi.reducer,
    [patientDashboardApi.reducerPath]: patientDashboardApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminDashboardApi.middleware,
      appointmentApi.middleware,
      authApi.middleware,
      doctorDashboardApi.middleware,
      patientDashboardApi.middleware,
      publicApi.middleware,
      reviewApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
