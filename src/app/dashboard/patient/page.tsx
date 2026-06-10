"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function PatientDashboardPage() {
  return (
    <RoleGuard allowedRole="patient">
      <DashboardLayout role="patient">
        <div className="mb-6">
          <Badge variant="secondary">Patient workspace</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Personal care overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View appointments, prescriptions, visits, and payment status.
          </p>
        </div>

        <DashboardContent />
      </DashboardLayout>
    </RoleGuard>
  );
}
