import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Doctor,
  DoctorFilters,
  PublicDetailResponse,
  PublicListResponse,
  Review,
  Specialty,
} from "@/types/public";

const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

function backendUrl(path: string) {
  return backendBaseUrl ? `${backendBaseUrl}${path}` : `/api/v1${path}`;
}

function toSearchParams(filters: DoctorFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    getDoctors: builder.query<PublicListResponse<Doctor>, DoctorFilters | void>({
      query: (filters) => {
        const query = toSearchParams(filters ?? {});

        return `${backendUrl("/doctor")}${query ? `?${query}` : ""}`;
      },
    }),
    getDoctorById: builder.query<PublicDetailResponse<Doctor>, string>({
      query: (id) => backendUrl(`/doctor/${id}`),
    }),
    getSpecialties: builder.query<PublicListResponse<Specialty>, void>({
      query: () => backendUrl("/specalties"),
    }),
    getReviews: builder.query<PublicListResponse<Review>, void>({
      query: () => backendUrl("/reviews"),
    }),
  }),
});

export const {
  useGetDoctorByIdQuery,
  useGetDoctorsQuery,
  useGetReviewsQuery,
  useGetSpecialtiesQuery,
} = publicApi;
