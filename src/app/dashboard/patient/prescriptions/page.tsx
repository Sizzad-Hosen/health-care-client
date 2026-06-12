"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PatientPrescriptions } from "@/components/dashboard/patient/PatientPrescriptions";
import { Badge } from "@/components/ui/badge";

export default function PatientPrescriptionsPage() {
  return (
    <RoleGuard allowedRole="patient">
      <DashboardLayout role="patient">
        <div className="mb-6">
          <Badge variant="secondary">Prescriptions</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            My prescriptions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review prescription instructions and follow-up dates from completed visits.
          </p>
        </div>
        <PatientPrescriptions />
      </DashboardLayout>
    </RoleGuard>
  );
}
