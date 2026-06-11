export type UserRole = "admin" | "super_admin" | "doctor" | "patient";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type UserProfile = AuthUser & {
  contactNumber?: string;
  address?: string;
  profilePhoto?: string;
  registrationNumber?: string;
  experience?: number;
  gender?: "MALE" | "FEMALE";
  appointmentFee?: number;
  qualification?: string;
  currentWorkingPlace?: string;
  designation?: string;
};

export type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken?: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type MessageResponse = {
  success?: boolean;
  message?: string;
};

export type ProfileResponse = {
  user: UserProfile;
};

export type UpdateProfileRequest = {
  name?: string;
  contactNumber?: string;
  address?: string;
  registrationNumber?: string;
  experience?: number | string;
  gender?: "MALE" | "FEMALE";
  appointmentFee?: number | string;
  qualification?: string;
  currentWorkingPlace?: string;
  designation?: string;
  file?: File | null;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
  role: "patient" | "doctor";
  registrationNumber?: string;
  experience?: number | string;
  gender?: "MALE" | "FEMALE";
  appointmentFee?: number | string;
  qualification?: string;
  currentWorkingPlace?: string;
  designation?: string;
};
