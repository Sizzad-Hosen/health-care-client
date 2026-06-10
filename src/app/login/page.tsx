import { AuthPageGuard } from "@/components/auth/AuthPageGuard";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthPageGuard>
      <AuthShell
        eyebrow="Welcome back"
        title="Sign in to your workspace"
        description="Use one of the demo healthcare accounts to access the correct role-based dashboard."
      >
        <LoginForm />
      </AuthShell>
    </AuthPageGuard>
  );
}
