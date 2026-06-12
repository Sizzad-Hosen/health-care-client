"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PatientProfileForm } from "@/components/dashboard/patient/PatientProfileForm";
import { Badge } from "@/components/ui/badge";

export default function PatientProfilePage() {
  return (
    <RoleGuard allowedRole="patient">
      <DashboardLayout role="patient">
        <div className="mb-6">
          <Badge variant="secondary">Profile</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Patient profile
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep your contact details, address, gender, and profile photo current.
          </p>
        </div>
        <PatientProfileForm />
      </DashboardLayout>
    </RoleGuard>
  );
}
