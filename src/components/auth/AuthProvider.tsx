"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserFromStorage } from "@/redux/features/auth/authSlice";
import { AppDispatch } from "@/redux/store";
import { readPersistedAuth } from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadUserFromStorage(readPersistedAuth()));
  }, [dispatch]);

  return children;
}
