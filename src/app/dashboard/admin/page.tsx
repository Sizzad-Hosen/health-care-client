"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  return (
    <RoleGuard allowedRole={["admin", "super_admin"]}>
      <DashboardLayout role="admin">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <Badge variant="secondary">Admin workspace</Badge>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Platform overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage clinic operations, doctors, patients, and appointments.
            </p>
          </div>
        </div>

        <DashboardContent />
      </DashboardLayout>
    </RoleGuard>
  );
}
