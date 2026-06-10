"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/types/auth";

export function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 lg:flex">
        <Sidebar role={role} />
        <div className="min-w-0 flex-1">
          <Topbar />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
