export type UserRole = "admin" | "doctor" | "patient";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};
