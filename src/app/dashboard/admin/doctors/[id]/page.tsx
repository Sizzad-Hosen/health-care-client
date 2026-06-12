"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DoctorDetailsManagement } from "@/components/dashboard/admin/DoctorDetailsManagement";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function AdminDoctorDetailsPage() {
  return (
    <RoleGuard allowedRole={["admin", "super_admin"]}>
      <DashboardLayout role="admin">
        <div className="mb-6">
          <Badge variant="secondary">Doctor details</Badge>
        </div>
        <DoctorDetailsManagement />
      </DashboardLayout>
    </RoleGuard>
  );
}
