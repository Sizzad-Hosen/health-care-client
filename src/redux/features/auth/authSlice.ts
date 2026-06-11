"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse, AuthState } from "@/types/auth";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.accessToken = null;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
    loadUserFromStorage: (state, action: PayloadAction<AuthResponse | null>) => {
      state.user = action.payload?.user ?? null;
      state.accessToken = null;
      state.isAuthenticated = Boolean(action.payload?.user);
      state.isInitialized = true;
    },
  },
});

export const { loadUserFromStorage, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
