"use client";

import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <DashboardLayout role={user?.role ?? "patient"}>
      <div className="mx-auto max-w-3xl">
        <ProfileForm />
      </div>
    </DashboardLayout>
  );
}
