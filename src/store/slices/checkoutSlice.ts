import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CheckoutRequest,
  CheckoutResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
  Order,
  OrdersResponse,
} from "@/types/checkout";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const checkoutApi = createApi({
  reducerPath: "checkoutApi",
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
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // 1. Checkout
    checkout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: "/public/orders/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    // 2. Verify Payment
    verifyPayment: builder.mutation<
      PaymentVerifyResponse,
      PaymentVerifyRequest
    >({
      query: (body) => ({
        url: "/public/payment/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    // 3. Get User Orders
    getOrders: builder.query<
      OrdersResponse,
      { page?: number; limit?: number; status?: string } | void
    >({
      query: (params) => ({
        url: "/orders",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({
                type: "Order" as const,
                id: _id,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

    // 4. Get Order by ID
    getOrderById: builder.query<{ order: Order }, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // 5. Update Order Status (Admin)
    updateOrderStatus: builder.mutation<
      { order: Order },
      {
        id: string;
        status?: string;
        paymentStatus?: string;
        trackingNumber?: string;
        carrier?: string;
        estimatedDelivery?: string;
        note?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCheckoutMutation,
  useVerifyPaymentMutation,
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = checkoutApi;
