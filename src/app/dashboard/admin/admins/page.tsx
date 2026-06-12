"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminsManagement } from "@/components/dashboard/admin/AdminsManagement";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function AdminManagementPage() {
  return (
    <RoleGuard allowedRole="super_admin">
      <DashboardLayout role="super_admin">
        <div className="mb-6">
          <Badge variant="secondary">Super Admin</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Admin management</h2>
          <p className="mt-1 text-sm text-slate-500">Create, edit, search, and remove admin accounts.</p>
        </div>
        <AdminsManagement />
      </DashboardLayout>
    </RoleGuard>
  );
}
