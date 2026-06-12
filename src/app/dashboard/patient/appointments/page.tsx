"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PatientAppointments } from "@/components/dashboard/patient/PatientAppointments";
import { Badge } from "@/components/ui/badge";

export default function PatientAppointmentsPage() {
  return (
    <RoleGuard allowedRole="patient">
      <DashboardLayout role="patient">
        <div className="mb-6">
          <Badge variant="secondary">Appointments</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            My appointments
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Track doctor details, schedule time, status, payment, and review actions.
          </p>
        </div>
        <PatientAppointments />
      </DashboardLayout>
    </RoleGuard>
  );
}
