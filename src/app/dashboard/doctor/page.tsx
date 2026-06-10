"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function DoctorDashboardPage() {
  return (
    <RoleGuard allowedRole="doctor">
      <DashboardLayout role="doctor">
        <div className="mb-6">
          <Badge variant="secondary">Doctor workspace</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Clinical schedule
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Track appointments, patients, and prescription tasks.
          </p>
        </div>

        <DashboardContent />
      </DashboardLayout>
    </RoleGuard>
  );
}
