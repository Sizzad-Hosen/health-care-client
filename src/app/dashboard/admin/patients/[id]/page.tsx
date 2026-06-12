"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { PatientDetailsManagement } from "@/components/dashboard/admin/PatientDetailsManagement";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function AdminPatientDetailsPage() {
  return (
    <RoleGuard allowedRole={["admin", "super_admin"]}>
      <DashboardLayout role="admin">
        <div className="mb-6">
          <Badge variant="secondary">Patient details</Badge>
        </div>
        <PatientDetailsManagement />
      </DashboardLayout>
    </RoleGuard>
  );
}
