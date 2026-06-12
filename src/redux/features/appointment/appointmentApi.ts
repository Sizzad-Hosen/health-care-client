import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Appointment,
  CreateAppointmentRequest,
  DoctorSchedule,
  DoctorScheduleFilters,
  InitPaymentResponse,
} from "@/types/appointment";
import { ApiListResponse, ApiResponse } from "@/types/api";

const backendProxyBase = "/api/backend/api/v1";

function toSearchParams(filters: DoctorScheduleFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: fetchBaseQuery({ baseUrl: backendProxyBase }),
  tagTypes: ["DoctorSchedules", "Appointments"],
  endpoints: (builder) => ({
    getAvailableDoctorSchedules: builder.query<
      ApiListResponse<DoctorSchedule>,
      DoctorScheduleFilters
    >({
      query: (filters) =>
        `/doctorSchedules?${toSearchParams({
          ...filters,
          isBooked: filters.isBooked ?? false,
        })}`,
      providesTags: (_result, _error, filters) => [
        { type: "DoctorSchedules", id: filters.doctorId },
      ],
    }),
    createAppointment: builder.mutation<
      ApiResponse<Appointment>,
      CreateAppointmentRequest
    >({
      query: (body) => ({
        url: "/appointments",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, body) => [
        { type: "DoctorSchedules", id: body.doctorId },
        { type: "Appointments", id: "MY_APPOINTMENTS" },
      ],
    }),
    initPayment: builder.mutation<ApiResponse<InitPaymentResponse>, string>({
      query: (appointmentId) => ({
        url: `/payments/init-payment/${appointmentId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useGetAvailableDoctorSchedulesQuery,
  useInitPaymentMutation,
} = appointmentApi;
