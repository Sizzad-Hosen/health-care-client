"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DoctorProfileForm } from "@/components/dashboard/doctor/DoctorProfileForm";
import { Badge } from "@/components/ui/badge";

export default function DoctorProfilePage() {
  return (
    <RoleGuard allowedRole="doctor">
      <DashboardLayout role="doctor">
        <div className="mb-6">
          <Badge variant="secondary">Profile</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Doctor profile
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Update your clinical profile, contact details, fee, and photo.
          </p>
        </div>
        <DoctorProfileForm />
      </DashboardLayout>
    </RoleGuard>
  );
}
