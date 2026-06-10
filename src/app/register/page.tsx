import { AuthPageGuard } from "@/components/auth/AuthPageGuard";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthPageGuard>
      <AuthShell
        eyebrow="Create account"
        title="Join the care workspace"
        description="Choose a role and the demo API will create a matching dashboard session."
      >
        <RegisterForm />
      </AuthShell>
    </AuthPageGuard>
  );
}
