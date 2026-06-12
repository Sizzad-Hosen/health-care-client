import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toUserProfile } from "@/lib/auth";
import {
  PatientAppointment,
  PatientInitPaymentResponse,
  PatientMeta,
  PatientQuery,
  PaginatedResult,
  Prescription,
  ReviewRequest,
  ReviewResponse,
} from "@/types/patient-dashboard";
import { ApiMeta, ApiResponse } from "@/types/api";
import { UpdateProfileRequest, UserProfile } from "@/types/auth";

type BackendListPayload<T> = {
  data?: T[] | { data?: T[]; meta?: ApiMeta };
  meta?: ApiMeta;
  message?: string;
  success?: boolean;
};

type BackendDetailPayload<T> = {
  data?: T;
  message?: string;
  success?: boolean;
};

const apiV1 = "/api/backend/api/v1";

function toSearchParams(query: PatientQuery = {}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

function normalizeList<T>(response: BackendListPayload<T>): PaginatedResult<T> {
  if (Array.isArray(response.data)) {
    return {
      data: response.data,
      meta: response.meta,
    };
  }

  return {
    data: response.data?.data ?? [],
    meta: response.data?.meta ?? response.meta,
  };
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

export const patientDashboardApi = createApi({
  reducerPath: "patientDashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  tagTypes: ["Meta", "Profile", "Appointments", "Prescriptions", "Reviews"],
  endpoints: (builder) => ({
    getPatientMeta: builder.query<ApiResponse<PatientMeta>, void>({
      query: () => `${apiV1}/meta`,
      providesTags: ["Meta"],
    }),
    getPatientProfile: builder.query<{ user: UserProfile }, void>({
      query: () => `${apiV1}/user/me`,
      transformResponse: (response: BackendDetailPayload<Record<string, unknown>>) => ({
        user: toUserProfile(response.data ?? {}),
      }),
      providesTags: ["Profile"],
    }),
    updatePatientProfile: builder.mutation<
      { user: UserProfile; message?: string },
      UpdateProfileRequest
    >({
      query: (body) => ({
        url: "/api/auth/profile",
        method: "PATCH",
        body: createProfileFormData(body),
      }),
      invalidatesTags: ["Profile", "Meta"],
    }),
    getMyAppointments: builder.query<PaginatedResult<PatientAppointment>, PatientQuery | void>({
      query: (query) => {
        const params = toSearchParams(query ?? { page: 1, limit: 10 });
        return `${apiV1}/appointments/my-appointment${params ? `?${params}` : ""}`;
      },
      transformResponse: (response: BackendListPayload<PatientAppointment>) =>
        normalizeList(response),
      providesTags: ["Appointments"],
    }),
    getMyPrescriptions: builder.query<PaginatedResult<Prescription>, PatientQuery | void>({
      query: (query) => {
        const params = toSearchParams(query ?? { page: 1, limit: 10 });
        return `${apiV1}/prescriptions/my-prescription${params ? `?${params}` : ""}`;
      },
      transformResponse: (response: BackendListPayload<Prescription>) =>
        normalizeList(response),
      providesTags: ["Prescriptions"],
    }),
    createReview: builder.mutation<ApiResponse<ReviewResponse>, ReviewRequest>({
      query: (body) => ({
        url: `${apiV1}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reviews", "Appointments", "Meta"],
    }),
    initPayment: builder.mutation<
      ApiResponse<PatientInitPaymentResponse>,
      string
    >({
      query: (appointmentId) => ({
        url: `${apiV1}/payments/init-payment/${appointmentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Appointments", "Meta"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetMyAppointmentsQuery,
  useGetMyPrescriptionsQuery,
  useGetPatientMetaQuery,
  useGetPatientProfileQuery,
  useInitPaymentMutation,
  useUpdatePatientProfileMutation,
} = patientDashboardApi;
