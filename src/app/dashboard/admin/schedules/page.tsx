"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { SchedulesManagement } from "@/components/dashboard/admin/SchedulesManagement";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function AdminSchedulesPage() {
  return (
    <RoleGuard allowedRole={["admin", "super_admin"]}>
      <DashboardLayout role="admin">
        <div className="mb-6">
          <Badge variant="secondary">Schedules</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Schedules management</h2>
          <p className="mt-1 text-sm text-slate-500">Create 30-minute schedule slots and remove available slots.</p>
        </div>
        <SchedulesManagement />
      </DashboardLayout>
    </RoleGuard>
  );
}
