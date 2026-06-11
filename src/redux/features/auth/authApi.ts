import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
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
  }),
});

export const {
  useLoginMutation,
  useLogoutUserMutation,
  useMeQuery,
  useCreatePatientMutation,
  useCreateDoctorMutation,
} = authApi;
