"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { roleDashboardPath } from "@/lib/auth";
import { RootState } from "@/redux/store";

export function AuthPageGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      router.replace(roleDashboardPath[user.role]);
    }
  }, [isAuthenticated, isInitialized, router, user]);

  if (!isInitialized || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  return children;
}
