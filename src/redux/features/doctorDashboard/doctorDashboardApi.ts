import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toUserProfile } from "@/lib/auth";
import { ApiMeta, ApiResponse } from "@/types/api";
import { Schedule } from "@/types/appointment";
import {
  AssignDoctorSchedulesRequest,
  CreatePrescriptionRequest,
  DoctorAppointment,
  DoctorMeta,
  DoctorQuery,
  DoctorScheduleRow,
  PaginatedResult,
  PrescriptionResponse,
  UpdateAppointmentStatusRequest,
} from "@/types/doctor-dashboard";
import { UpdateProfileRequest, UserProfile } from "@/types/auth";

type BackendListPayload<T> = {
  data?: T[] | { data?: T[]; meta?: ApiMeta };
  meta?: ApiMeta;
};

type BackendDetailPayload<T> = {
  data?: T;
  message?: string;
};

const apiV1 = "/api/backend/api/v1";

function toSearchParams(query: DoctorQuery = {}) {
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
    return { data: response.data, meta: response.meta };
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
        cleanProfile.experience === undefined ? undefined : Number(cleanProfile.experience),
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

export const doctorDashboardApi = createApi({
  reducerPath: "doctorDashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  tagTypes: ["DoctorMeta", "DoctorProfile", "DoctorSchedules", "AvailableSchedules", "DoctorAppointments"],
  endpoints: (builder) => ({
    getDoctorMeta: builder.query<ApiResponse<DoctorMeta>, void>({
      query: () => `${apiV1}/meta`,
      providesTags: ["DoctorMeta"],
    }),
    getDoctorProfile: builder.query<{ user: UserProfile }, void>({
      query: () => `${apiV1}/user/me`,
      transformResponse: (response: BackendDetailPayload<Record<string, unknown>>) => ({
        user: toUserProfile(response.data ?? {}),
      }),
      providesTags: ["DoctorProfile"],
    }),
    updateDoctorProfile: builder.mutation<
      { user: UserProfile; message?: string },
      UpdateProfileRequest
    >({
      query: (body) => ({
        url: "/api/auth/profile",
        method: "PATCH",
        body: createProfileFormData(body),
      }),
      invalidatesTags: ["DoctorProfile", "DoctorMeta"],
    }),
    getMyDoctorSchedules: builder.query<PaginatedResult<DoctorScheduleRow>, DoctorQuery | void>({
      query: (query) => {
        const params = toSearchParams(query ?? { page: 1, limit: 10 });
        return `${apiV1}/doctorSchedules/my-schedule${params ? `?${params}` : ""}`;
      },
      transformResponse: (response: BackendListPayload<DoctorScheduleRow>) =>
        normalizeList(response),
      providesTags: ["DoctorSchedules"],
    }),
    getAvailableSchedules: builder.query<PaginatedResult<Schedule>, DoctorQuery | void>({
      query: (query) => {
        const params = toSearchParams(query ?? { page: 1, limit: 20 });
        return `${apiV1}/schedules${params ? `?${params}` : ""}`;
      },
      transformResponse: (response: BackendListPayload<Schedule>) =>
        normalizeList(response),
      providesTags: ["AvailableSchedules"],
    }),
    assignDoctorSchedules: builder.mutation<
      ApiResponse<{ count?: number }>,
      AssignDoctorSchedulesRequest
    >({
      query: (body) => ({
        url: `${apiV1}/doctorSchedules`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["DoctorSchedules", "AvailableSchedules", "DoctorMeta"],
    }),
    deleteDoctorSchedule: builder.mutation<ApiResponse<unknown>, string>({
      query: (scheduleId) => ({
        url: `${apiV1}/doctorSchedules/${scheduleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DoctorSchedules", "AvailableSchedules", "DoctorMeta"],
    }),
    getDoctorAppointments: builder.query<PaginatedResult<DoctorAppointment>, DoctorQuery | void>({
      query: (query) => {
        const params = toSearchParams(query ?? { page: 1, limit: 10 });
        return `${apiV1}/appointments/my-appointment${params ? `?${params}` : ""}`;
      },
      transformResponse: (response: BackendListPayload<DoctorAppointment>) =>
        normalizeList(response),
      providesTags: ["DoctorAppointments"],
    }),
    updateAppointmentStatus: builder.mutation<
      ApiResponse<DoctorAppointment>,
      UpdateAppointmentStatusRequest
    >({
      query: ({ appointmentId, status }) => ({
        url: `${apiV1}/appointments/status/${appointmentId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["DoctorAppointments", "DoctorMeta"],
    }),
    createPrescription: builder.mutation<
      ApiResponse<PrescriptionResponse>,
      CreatePrescriptionRequest
    >({
      query: (body) => ({
        url: `${apiV1}/prescriptions`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["DoctorAppointments", "DoctorMeta"],
    }),
  }),
});

export const {
  useAssignDoctorSchedulesMutation,
  useCreatePrescriptionMutation,
  useDeleteDoctorScheduleMutation,
  useGetAvailableSchedulesQuery,
  useGetDoctorAppointmentsQuery,
  useGetDoctorMetaQuery,
  useGetDoctorProfileQuery,
  useGetMyDoctorSchedulesQuery,
  useUpdateAppointmentStatusMutation,
  useUpdateDoctorProfileMutation,
} = doctorDashboardApi;
