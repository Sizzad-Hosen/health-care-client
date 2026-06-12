import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/auth/authSlice";
import { appointmentApi } from "@/redux/features/appointment/appointmentApi";
import { authApi } from "@/redux/features/auth/authApi";
import { publicApi } from "@/redux/features/public/publicApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      appointmentApi.middleware,
      authApi.middleware,
      publicApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
