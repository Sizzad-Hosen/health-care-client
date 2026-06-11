import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  AuthUser,
} from "@/types/auth";

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
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/api/auth/register",
        method: "POST",
        body,
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
  useRegisterMutation,
} = authApi;
