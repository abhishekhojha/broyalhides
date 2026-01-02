import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Cart,
  AddToCartRequest,
  UpdateCartRequest,
  RemoveItemRequest,
  SyncCartRequest,
  CartResponse,
} from "@/types/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/cart`,
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
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    // 1. Get Cart
    getCart: builder.query<Cart, void>({
      query: () => "",
      providesTags: ["Cart"],
    }),

    // 2. Add to Cart
    addToCart: builder.mutation<CartResponse, AddToCartRequest>({
      query: (body) => ({
        url: "/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // 3. Update Cart Item
    updateCartItem: builder.mutation<CartResponse, UpdateCartRequest>({
      query: (body) => ({
        url: "/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // 4. Remove Cart Item
    removeCartItem: builder.mutation<CartResponse, RemoveItemRequest>({
      query: (body) => ({
        url: "/remove",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // 5. Sync Cart
    syncCart: builder.mutation<CartResponse, SyncCartRequest>({
      query: (body) => ({
        url: "/sync",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useLazyGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useSyncCartMutation,
} = cartApi;
