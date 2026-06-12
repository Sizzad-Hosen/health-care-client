import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiMeta, ApiResponse } from "@/types/api";
import {
  AdminAppointment,
  AdminDoctor,
  AdminMeta,
  AdminPatient,
  AdminPrescription,
  AdminQuery,
  AdminSchedule,
  AdminSpecialty,
  AdminUser,
  CreateScheduleRequest,
  CreateSpecialtyRequest,
  PaginatedResult,
  UpdateDoctorRequest,
  UpdatePatientRequest,
} from "@/types/admin-dashboard";

type BackendListPayload<T> = {
  data?: T[] | { data?: T[]; meta?: ApiMeta };
  meta?: ApiMeta;
};


const apiV1 = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

function toSearchParams(query: AdminQuery = {}) {
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

function specialtyFormData(body: CreateSpecialtyRequest) {
  const formData = new FormData();
  formData.append("data", JSON.stringify({ title: body.title }));

  if (body.file) {
    formData.append("file", body.file);
  }

  return formData;
}

export const adminDashboardApi = createApi({
  reducerPath: "adminDashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  tagTypes: [
    "AdminMeta",
    "Admins",
    "Doctors",
    "Patients",
    "Appointments",
    "Prescriptions",
    "Specialties",
    "Schedules",
  ],
  endpoints: (builder) => ({
    getAdminMeta: builder.query<ApiResponse<AdminMeta>, void>({
      query: () => `${apiV1}/meta`,
      providesTags: ["AdminMeta"],
    }),
    getAdmins: builder.query<PaginatedResult<AdminUser>, AdminQuery | void>({
      query: (query) => {
        const params = toSearchParams(query ?? { page: 1, limit: 10 });
        return `${apiV1}/admin${params ? `?${params}` : ""}`;
      },
      transformResponse: (response: BackendListPayload<AdminUser>) =>
        normalizeList(response),
      providesTags: ["Admins"],
    }),
    getDoctors: builder.query<PaginatedResult<AdminDoctor>, AdminQuery | void>({
      query: (query) => {
        const params = toSearchParams(query ?? { page: 1, limit: 10 });
        return `${apiV1}/doctor${params ? `?${params}` : ""}`;
      },
      transformResponse: (response: BackendListPayload<AdminDoctor>) =>
        normalizeList(response),
      providesTags: ["Doctors"],
    }),
    getDoctorById: builder.query<ApiResponse<AdminDoctor>, string>({
      query: (id) => `${apiV1}/doctor/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Doctors", id }],
    }),
    updateDoctor: builder.mutation<ApiResponse<AdminDoctor>, UpdateDoctorRequest>({
      query: ({ id, body }) => ({
        url: `${apiV1}/doctor/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Doctors",
        "AdminMeta",
        { type: "Doctors", id },
      ],
    }),
    softDeleteDoctor: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `${apiV1}/doctor/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctors", "AdminMeta"],
    }),
    deleteDoctor: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `${apiV1}/doctor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctors", "AdminMeta"],
    }),
    getPatients: builder.query<PaginatedResult<AdminPatient>, AdminQuery | void>({
      query: (query) => {
        const params = toSearchParams(query ?? { page: 1, limit: 10 });
        return `${apiV1}/patient${params ? `?${params}` : ""}`;
      },
      transformResponse: (response: BackendListPayload<AdminPatient>) =>
        normalizeList(response),
      providesTags: ["Patients"],
    }),
    getPatientById: builder.query<ApiResponse<AdminPatient>, string>({
      query: (id) => `${apiV1}/patient/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Patients", id }],
    }),
    updatePatient: builder.mutation<ApiResponse<AdminPatient>, UpdatePatientRequest>({
      query: ({ id, body }) => ({
        url: `${apiV1}/patient/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Patients",
        "AdminMeta",
        { type: "Patients", id },
      ],
    }),
    softDeletePatient: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `${apiV1}/patient/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patients", "AdminMeta"],
    }),
    deletePatient: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `${apiV1}/patient/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patients", "AdminMeta"],
    }),
    getAppointments: builder.query<PaginatedResult<AdminAppointment>, AdminQuery | void>({
      query: (query) => {
        const params = toSearchParams(query ?? { page: 1, limit: 10 });
        return `${apiV1}/appointments${params ? `?${params}` : ""}`;
      },
      transformResponse: (response: BackendListPayload<AdminAppointment>) =>
        normalizeList(response),
      providesTags: ["Appointments"],
    }),
    getPrescriptions: builder.query<PaginatedResult<AdminPrescription>, AdminQuery | void>({
      query: (query) => {
        const params = toSearchParams(query ?? { page: 1, limit: 10 });
        return `${apiV1}/prescriptions${params ? `?${params}` : ""}`;
      },
      transformResponse: (response: BackendListPayload<AdminPrescription>) =>
        normalizeList(response),
      providesTags: ["Prescriptions"],
    }),
    getSpecialties: builder.query<PaginatedResult<AdminSpecialty>, void>({
      query: () => `${apiV1}/specalties`,
      transformResponse: (response: BackendListPayload<AdminSpecialty>) =>
        normalizeList(response),
      providesTags: ["Specialties"],
    }),
    createSpecialty: builder.mutation<ApiResponse<AdminSpecialty>, CreateSpecialtyRequest>({
      query: (body) => ({
        url: `${apiV1}/specalties`,
        method: "POST",
        body: specialtyFormData(body),
      }),
      invalidatesTags: ["Specialties", "AdminMeta"],
    }),
    deleteSpecialty: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `${apiV1}/specalties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specialties", "AdminMeta"],
    }),
    getSchedules: builder.query<PaginatedResult<AdminSchedule>, AdminQuery | void>({
      query: (query) => {
        const params = toSearchParams(query ?? { page: 1, limit: 10 });
        return `${apiV1}/schedules${params ? `?${params}` : ""}`;
      },
      transformResponse: (response: BackendListPayload<AdminSchedule>) =>
        normalizeList(response),
      providesTags: ["Schedules"],
    }),
    createSchedules: builder.mutation<ApiResponse<AdminSchedule[]>, CreateScheduleRequest>({
      query: (body) => ({
        url: `${apiV1}/schedules`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Schedules", "AdminMeta"],
    }),
    deleteSchedule: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `${apiV1}/schedules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Schedules", "AdminMeta"],
    }),
  }),
});

export const {
  useCreateSchedulesMutation,
  useCreateSpecialtyMutation,
  useDeleteDoctorMutation,
  useDeletePatientMutation,
  useDeleteScheduleMutation,
  useDeleteSpecialtyMutation,
  useGetAdminMetaQuery,
  useGetAdminsQuery,
  useGetAppointmentsQuery,
  useGetDoctorByIdQuery,
  useGetDoctorsQuery,
  useGetPatientByIdQuery,
  useGetPatientsQuery,
  useGetPrescriptionsQuery,
  useGetSchedulesQuery,
  useGetSpecialtiesQuery,
  useSoftDeleteDoctorMutation,
  useSoftDeletePatientMutation,
  useUpdateDoctorMutation,
  useUpdatePatientMutation,
} = adminDashboardApi;
