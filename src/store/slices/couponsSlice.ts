import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Coupon,
  ApplyCouponRequest,
  ApplyCouponResponse,
  CouponsResponse,
} from "@/types/coupon";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const couponsApi = createApi({
  reducerPath: "couponsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/coupons`,
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
  tagTypes: ["Coupon"],
  endpoints: (builder) => ({
    // 1. Apply Coupon (Public)
    applyCoupon: builder.mutation<ApplyCouponResponse, ApplyCouponRequest>({
      query: (body) => ({
        url: "/apply",
        method: "POST",
        body,
      }),
    }),

    // 2. Get All Coupons (Admin - MANAGE_COUPONS)
    getCoupons: builder.query<
      CouponsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        isActive?: boolean;
      } | void
    >({
      query: (params) => ({
        url: "",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.coupons.map(({ _id }) => ({
                type: "Coupon" as const,
                id: _id,
              })),
              { type: "Coupon", id: "LIST" },
            ]
          : [{ type: "Coupon", id: "LIST" }],
    }),

    // 3. Create Coupon (Admin)
    createCoupon: builder.mutation<
      { success: boolean; coupon: Coupon },
      Partial<Coupon>
    >({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),

    // 4. Update Coupon (Admin)
    updateCoupon: builder.mutation<
      { success: boolean; coupon: Coupon },
      { id: string; updates: Partial<Coupon> }
    >({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Coupon", id },
        { type: "Coupon", id: "LIST" },
      ],
    }),

    // 5. Delete Coupon (Admin)
    deleteCoupon: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
  }),
});

export const {
  useApplyCouponMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponsApi;
