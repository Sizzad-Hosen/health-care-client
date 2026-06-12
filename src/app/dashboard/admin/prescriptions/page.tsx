"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { PrescriptionsManagement } from "@/components/dashboard/admin/PrescriptionsManagement";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function AdminPrescriptionsPage() {
  return (
    <RoleGuard allowedRole={["admin", "super_admin"]}>
      <DashboardLayout role="admin">
        <div className="mb-6">
          <Badge variant="secondary">Prescriptions</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Prescriptions list</h2>
          <p className="mt-1 text-sm text-slate-500">Review prescription records across the platform.</p>
        </div>
        <PrescriptionsManagement />
      </DashboardLayout>
    </RoleGuard>
  );
}
