"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { roleDashboardPath } from "@/lib/auth";
import { RootState } from "@/redux/store";
import { UserRole } from "@/types/auth";

export function RoleGuard({
  allowedRole,
  children,
}: {
  allowedRole: UserRole | UserRole[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isInitialized, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

    if (user && !allowedRoles.includes(user.role)) {
      router.replace("/unauthorized");
    }
  }, [allowedRole, isAuthenticated, isInitialized, router, user]);

  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

  if (!isInitialized || !isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking access...
      </div>
    );
  }

  return children;
}

export function DashboardRedirect() {
  const router = useRouter();
  const { user, isInitialized, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    router.replace(roleDashboardPath[user.role]);
  }, [isAuthenticated, isInitialized, router, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
      Opening dashboard...
    </div>
  );
}
