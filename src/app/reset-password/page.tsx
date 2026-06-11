import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Password recovery"
      title="Choose a new password"
      description="Use the reset token from your email to secure your account."
    >
      <Suspense
        fallback={
          <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Loading reset form...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
