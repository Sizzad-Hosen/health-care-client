"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DoctorsManagement } from "@/components/dashboard/admin/DoctorsManagement";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function AdminDoctorsPage() {
  return (
    <RoleGuard allowedRole={["admin", "super_admin"]}>
      <DashboardLayout role="admin">
        <div className="mb-6">
          <Badge variant="secondary">Doctors</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Doctors management</h2>
          <p className="mt-1 text-sm text-slate-500">Search, paginate, and view doctor profile details.</p>
        </div>
        <DoctorsManagement />
      </DashboardLayout>
    </RoleGuard>
  );
}
