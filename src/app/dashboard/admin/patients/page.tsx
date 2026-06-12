"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { PatientsManagement } from "@/components/dashboard/admin/PatientsManagement";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function AdminPatientsPage() {
  return (
    <RoleGuard allowedRole={["admin", "super_admin"]}>
      <DashboardLayout role="admin">
        <div className="mb-6">
          <Badge variant="secondary">Patients</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Patients management</h2>
          <p className="mt-1 text-sm text-slate-500">Search, edit, paginate, and soft delete patient profiles.</p>
        </div>
        <PatientsManagement />
      </DashboardLayout>
    </RoleGuard>
  );
}
