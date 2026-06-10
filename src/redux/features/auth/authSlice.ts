"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse, AuthState } from "@/types/auth";
import { clearPersistedAuth, persistAuth } from "@/lib/auth";

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
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isInitialized = true;
      persistAuth(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      clearPersistedAuth();
    },
    loadUserFromStorage: (state, action: PayloadAction<AuthResponse | null>) => {
      state.user = action.payload?.user ?? null;
      state.accessToken = action.payload?.accessToken ?? null;
      state.isAuthenticated = Boolean(action.payload?.accessToken);
      state.isInitialized = true;
    },
  },
});

export const { loadUserFromStorage, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
