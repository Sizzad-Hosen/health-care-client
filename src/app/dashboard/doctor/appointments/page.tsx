"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DoctorAppointments } from "@/components/dashboard/doctor/DoctorAppointments";
import { Badge } from "@/components/ui/badge";

export default function DoctorAppointmentsPage() {
  return (
    <RoleGuard allowedRole="doctor">
      <DashboardLayout role="doctor">
        <div className="mb-6">
          <Badge variant="secondary">Appointments</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            My appointments
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage patient appointments, statuses, payments, and prescriptions.
          </p>
        </div>
        <DoctorAppointments />
      </DashboardLayout>
    </RoleGuard>
  );
}
