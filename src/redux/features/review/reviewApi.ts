import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiListResponse, ApiResponse } from "@/types/api";
import { CreateReviewRequest, Review, ReviewFilters } from "@/types/public";
import { patientDashboardApi } from "@/redux/features/patientDashboard/patientDashboardApi";

const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
const authenticatedApiV1 = "/api/backend/api/v1";

function backendUrl(path: string) {
  return backendBaseUrl ? `${backendBaseUrl}${path}` : `/api/v1${path}`;
}

function toSearchParams(filters: ReviewFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    getReviews: builder.query<ApiListResponse<Review>, ReviewFilters | void>({
      query: (filters) => {
        const query = toSearchParams(filters ?? {});

        return `${backendUrl("/reviews")}${query ? `?${query}` : ""}`;
      },
      providesTags: ["Reviews"],
    }),
    createReview: builder.mutation<ApiResponse<Review>, CreateReviewRequest>({
      query: (body) => ({
        url: `${authenticatedApiV1}/reviews`,
        method: "POST",
        body,
      }),
      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(patientDashboardApi.util.invalidateTags(["Appointments", "Meta"]));
        } catch {
          // The component toast handles create errors; appointment cache stays unchanged.
        }
      },
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const { useCreateReviewMutation, useGetReviewsQuery } = reviewApi;
