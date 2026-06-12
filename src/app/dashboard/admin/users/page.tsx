"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { UserManagement } from "@/components/dashboard/admin/UserManagement";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  return (
    <RoleGuard allowedRole={["admin", "super_admin"]}>
      <DashboardLayout role="admin">
        <div className="mb-6">
          <Badge variant="secondary">User Management</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">User management</h2>
          <p className="mt-1 text-sm text-slate-500">Open doctor and patient profile records.</p>
        </div>
        <UserManagement />
      </DashboardLayout>
    </RoleGuard>
  );
}
