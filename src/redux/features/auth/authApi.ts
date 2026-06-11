import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  ProfileResponse,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  AuthUser,
} from "@/types/auth";

const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

function backendUrl(path: string) {
  return backendBaseUrl ? `${backendBaseUrl}${path}` : `/api/v1${path}`;
}

function createPatientFormData(body: RegisterRequest) {
  const formData = new FormData();

  formData.append(
    "data",
    JSON.stringify({
      password: body.password,
      patient: {
        name: body.name,
        email: body.email,
        contactNumber: body.contactNumber,
        address: body.address,
      },
    }),
  );

  return formData;
}

function createDoctorFormData(body: RegisterRequest) {
  const formData = new FormData();

  formData.append(
    "data",
    JSON.stringify({
      password: body.password,
      doctor: {
        name: body.name,
        email: body.email,
        contactNumber: body.contactNumber,
        address: body.address,
        registrationNumber: body.registrationNumber,
        experience:
          body.experience === undefined || body.experience === ""
            ? undefined
            : Number(body.experience),
        gender: body.gender,
        appointmentFee: Number(body.appointmentFee),
        qualification: body.qualification,
        currentWorkingPlace: body.currentWorkingPlace,
        designation: body.designation,
      },
    }),
  );

  return formData;
}

function createProfileFormData(body: UpdateProfileRequest) {
  const { file, ...profile } = body;
  const cleanProfile = Object.fromEntries(
    Object.entries(profile).filter(([, value]) => value !== "" && value !== undefined),
  );
  const formData = new FormData();

  formData.append(
    "data",
    JSON.stringify({
      ...cleanProfile,
      experience:
        cleanProfile.experience === undefined
          ? undefined
          : Number(cleanProfile.experience),
      appointmentFee:
        cleanProfile.appointmentFee === undefined
          ? undefined
          : Number(cleanProfile.appointmentFee),
    }),
  );

  if (file) {
    formData.append("file", file);
  }

  return formData;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body,
      }),
    }),
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/api/auth/refresh-token",
        method: "POST",
      }),
    }),
    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation<MessageResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: "/api/auth/change-password",
        method: "POST",
        body,
      }),
    }),


    createPatient: builder.mutation<unknown, RegisterRequest>({
      query: (body) => ({
        url: backendUrl("/user/create-patient"),
        method: "POST",
        body: createPatientFormData(body),
      }),
    }),


    createDoctor: builder.mutation<unknown, RegisterRequest>({
      query: (body) => ({
        url: backendUrl("/user/create-doctor"),
        method: "POST",
        body: createDoctorFormData(body),
      }),
    }),
    logoutUser: builder.mutation<{ success: true }, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
    }),
    me: builder.query<{ user: AuthUser }, void>({
      query: () => "/api/auth/me",
    }),
    profile: builder.query<ProfileResponse, void>({
      query: () => "/api/auth/profile",
    }),
    updateProfile: builder.mutation<ProfileResponse & MessageResponse, UpdateProfileRequest>({
      query: (body) => ({
        url: "/api/auth/profile",
        method: "PATCH",
        body: createProfileFormData(body),
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useLogoutUserMutation,
  useMeQuery,
  useCreatePatientMutation,
  useCreateDoctorMutation,
  useProfileQuery,
  useUpdateProfileMutation,
} = authApi;
