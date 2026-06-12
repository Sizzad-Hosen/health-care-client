"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DoctorSchedules } from "@/components/dashboard/doctor/DoctorSchedules";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DoctorSchedulesPage() {
  return (
    <RoleGuard allowedRole="doctor">
      <DashboardLayout role="doctor">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge variant="secondary">Schedules</Badge>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              My schedules
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View assigned slots, filter by date, and remove open assignments.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/doctor/schedules/assign">Assign schedules</Link>
          </Button>
        </div>
        <DoctorSchedules />
      </DashboardLayout>
    </RoleGuard>
  );
}
