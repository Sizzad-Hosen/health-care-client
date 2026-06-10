import { AuthResponse, AuthUser, UserRole } from "@/types/auth";

const AUTH_STORAGE_KEY = "health-care-auth";

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

export const mockUsers: Array<AuthUser & { password: string }> = [
  {
    id: "user-admin",
    name: "Admin User",
    email: "admin@healthcare.com",
    password: "password123",
    role: "admin",
  },
  {
    id: "user-doctor",
    name: "Doctor User",
    email: "doctor@healthcare.com",
    password: "password123",
    role: "doctor",
  },
  {
    id: "user-patient",
    name: "Patient User",
    email: "patient@healthcare.com",
    password: "password123",
    role: "patient",
  },
];

export function createFakeToken(user: AuthUser): string {
  const payload = Buffer.from(
    JSON.stringify({ id: user.id, email: user.email, role: user.role }),
  ).toString("base64url");

  return `demo.${payload}.token`;
}

export function userFromToken(token: string): AuthUser | null {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      id: string;
      email: string;
      role: UserRole;
    };
    const user = mockUsers.find((item) => item.email === parsed.email);

    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    }

    return {
      id: parsed.id,
      name: parsed.email.split("@")[0],
      email: parsed.email,
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

export function persistAuth(auth: AuthResponse): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function readPersistedAuth(): AuthResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthResponse;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearPersistedAuth(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
}
