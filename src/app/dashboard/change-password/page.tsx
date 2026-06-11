"use client";

import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ChangePasswordPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <DashboardLayout role={user?.role ?? "patient"}>
      <div className="mx-auto max-w-xl">
        <ChangePasswordForm />
      </div>
    </DashboardLayout>
  );
}
