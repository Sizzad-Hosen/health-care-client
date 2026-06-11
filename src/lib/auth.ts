import { AuthUser, UserProfile, UserRole } from "@/types/auth";

export const roleDashboardPath: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  super_admin: "/dashboard/admin",
  doctor: "/dashboard/doctor",
  patient: "/dashboard/patient",
};

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  super_admin: "Super Admin",
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

export function toUserProfile(profile: Record<string, unknown>): UserProfile {
  const user = toAuthUser(profile);

  return {
    ...user,
    contactNumber: profile.contactNumber ? String(profile.contactNumber) : undefined,
    address: profile.address ? String(profile.address) : undefined,
    profilePhoto: profile.profilePhoto ? String(profile.profilePhoto) : undefined,
    registrationNumber: profile.registrationNumber
      ? String(profile.registrationNumber)
      : undefined,
    experience:
      typeof profile.experience === "number" ? profile.experience : undefined,
    gender:
      profile.gender === "MALE" || profile.gender === "FEMALE"
        ? profile.gender
        : undefined,
    appointmentFee:
      typeof profile.appointmentFee === "number"
        ? profile.appointmentFee
        : undefined,
    qualification: profile.qualification ? String(profile.qualification) : undefined,
    currentWorkingPlace: profile.currentWorkingPlace
      ? String(profile.currentWorkingPlace)
      : undefined,
    designation: profile.designation ? String(profile.designation) : undefined,
  };
}
