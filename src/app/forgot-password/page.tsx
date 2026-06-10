import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Password recovery"
      title="Reset your password"
      description="Enter your account email to see the password reset confirmation UI."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
