import { AuthUser, UserRole } from "@/types/auth";

export const roleDashboardPath: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  doctor: "/dashboard/doctor",
  patient: "/dashboard/patient",
};

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  doctor: "Doctor",
  patient: "Patient",
};

export function toAuthUser(profile: Partial<AuthUser> & Record<string, unknown>): AuthUser {
  const role = String(profile.role ?? "patient").toLowerCase() as UserRole;
  const email = String(profile.email ?? "");

  return {
    id: String(profile.id ?? email),
    name: String(profile.name ?? email.split("@")[0] ?? "User"),
    email,
    role,
  };
}
