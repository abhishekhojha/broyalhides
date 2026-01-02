import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  OTPRequest,
  OTPVerifyRequest,
  LoginRequest,
  CompleteProfileRequest,
  AuthResponse,
  UserProfile,
} from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    // 1. Send OTP
    sendOTP: builder.mutation<{ message: string }, OTPRequest>({
      query: (body) => ({
        url: "/auth/send-otp",
        method: "POST",
        body,
      }),
    }),

    // 2. Verify OTP
    verifyOTP: builder.mutation<AuthResponse, OTPVerifyRequest>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.accessToken && typeof window !== "undefined") {
            localStorage.setItem("token", data.accessToken);
          }
        } catch (error) {
          // Error handled by component
        }
      },
    }),

    // 3. Login with Password
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.accessToken && typeof window !== "undefined") {
            localStorage.setItem("token", data.accessToken);
          }
        } catch (error) {
          // Error handled by component
        }
      },
    }),

    // 4. Complete Profile
    completeProfile: builder.mutation<AuthResponse, CompleteProfileRequest>({
      query: (body) => ({
        url: "/auth/complete-profile",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.accessToken && typeof window !== "undefined") {
            localStorage.setItem("token", data.accessToken);
          }
        } catch (error) {
          // Error handled by component
        }
      },
    }),

    // 5. Get Current User Profile
    getProfile: builder.query<{ user: UserProfile }, void>({
      query: () => "/me",
      providesTags: ["Profile"],
    }),
  }),
});

export const {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useLoginMutation,
  useCompleteProfileMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
} = authApi;
