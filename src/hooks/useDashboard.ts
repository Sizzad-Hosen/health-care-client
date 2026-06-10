"use client";

import { useCallback, useEffect, useState } from "react";
import { getDashboardData } from "@/services/dashboardApi";
import { AsyncStatus } from "@/types/api";
import { AuthUser } from "@/types/auth";
import { DashboardData } from "@/types/dashboard";

export function useDashboard(user: AuthUser | null) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!user) {
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const result = await getDashboardData(user);
      setData(result);
      setStatus("success");
    } catch (caughtError) {
      setData(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to load dashboard data.",
      );
      setStatus("error");
    }
  }, [user]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadDashboard]);

  return {
    data,
    error,
    isEmpty: status === "success" && (!data || data.metrics.length === 0),
    isError: status === "error",
    isLoading: status === "loading" || status === "idle",
    refresh: loadDashboard,
    status,
  };
}
