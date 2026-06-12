"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ScheduleAssignment } from "@/components/dashboard/doctor/ScheduleAssignment";
import { Badge } from "@/components/ui/badge";

export default function AssignDoctorSchedulesPage() {
  return (
    <RoleGuard allowedRole="doctor">
      <DashboardLayout role="doctor">
        <div className="mb-6">
          <Badge variant="secondary">Schedule assignment</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Assign available slots
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Select multiple available schedule slots and add them to your calendar.
          </p>
        </div>
        <ScheduleAssignment />
      </DashboardLayout>
    </RoleGuard>
  );
}
