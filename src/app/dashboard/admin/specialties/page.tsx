"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { SpecialtiesManagement } from "@/components/dashboard/admin/SpecialtiesManagement";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function AdminSpecialtiesPage() {
  return (
    <RoleGuard allowedRole={["admin", "super_admin"]}>
      <DashboardLayout role="admin">
        <div className="mb-6">
          <Badge variant="secondary">Specialties</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Specialties management</h2>
          <p className="mt-1 text-sm text-slate-500">Create specialties with optional icons and delete existing specialties.</p>
        </div>
        <SpecialtiesManagement />
      </DashboardLayout>
    </RoleGuard>
  );
}
