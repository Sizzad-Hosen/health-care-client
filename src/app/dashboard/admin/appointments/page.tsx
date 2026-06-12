"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { AppointmentsManagement } from "@/components/dashboard/admin/AppointmentsManagement";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function AdminAppointmentsPage() {
  return (
    <RoleGuard allowedRole={["admin", "super_admin"]}>
      <DashboardLayout role="admin">
        <div className="mb-6">
          <Badge variant="secondary">Appointments</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Appointments management</h2>
          <p className="mt-1 text-sm text-slate-500">Filter appointments by status, payment status, and patient email.</p>
        </div>
        <AppointmentsManagement />
      </DashboardLayout>
    </RoleGuard>
  );
}
