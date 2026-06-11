"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserFromStorage } from "@/redux/features/auth/authSlice";
import { AppDispatch } from "@/redux/store";
import { useMeQuery } from "@/redux/features/auth/authApi";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isError, isLoading } = useMeQuery();

  useEffect(() => {
    if (data?.user) {
      dispatch(loadUserFromStorage({ user: data.user, accessToken: null }));
      return;
    }

    if (isError || !isLoading) {
      dispatch(loadUserFromStorage(null));
    }
  }, [data?.user, dispatch, isError, isLoading]);

  return children;
}
