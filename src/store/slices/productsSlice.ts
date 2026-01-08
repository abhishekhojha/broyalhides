import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Product,
  ProductsResponse,
  ProductFilters,
  Variant,
  CreateProductRequest,
  CreateVariantRequest,
} from "@/types/product";
import type { SuccessResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/products`,
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
  tagTypes: ["Product", "Variant"],
  endpoints: (builder) => ({
    // GET all products with filters and pagination
    getProducts: builder.query<ProductsResponse, ProductFilters | void>({
      query: (filters) => {
        const params = filters || {};
        return {
          url: "",
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // GET product by ID
    getProductById: builder.query<{ product: Product }, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // GET product by slug
    getProductBySlug: builder.query<{ product: Product }, string>({
      query: (slug) => `/slug/${slug}`,
      providesTags: (result) =>
        result ? [{ type: "Product", id: result.product._id }] : [],
    }),

    // CREATE product (protected - requires MANAGE_PRODUCTS permission)
    createProduct: builder.mutation<{ product: Product }, CreateProductRequest>(
      {
        query: (body) => ({
          url: "",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "Product", id: "LIST" }],
      }
    ),

    // UPDATE product (protected)
    updateProduct: builder.mutation<
      { product: Product },
      { id: string; updates: Partial<Product> }
    >({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // DELETE product (protected)
    deleteProduct: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // GET variants for a product
    getProductVariants: builder.query<{ variants: Variant[] }, string>({
      query: (productId) => `/${productId}/variants`,
      providesTags: (result, error, productId) =>
        result
          ? [
              ...result.variants.map(({ _id }) => ({
                type: "Variant" as const,
                id: _id,
              })),
              { type: "Variant", id: productId },
            ]
          : [{ type: "Variant", id: productId }],
    }),

    // ADD variant to product (protected)
    addVariant: builder.mutation<
      { variant: Variant },
      { productId: string; variant: CreateVariantRequest }
    >({
      query: ({ productId, variant }) => ({
        url: `/${productId}/variant`,
        method: "POST",
        body: variant,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Variant", id: productId },
        { type: "Product", id: productId },
      ],
    }),

    // GET variant by ID
    getVariantById: builder.query<{ variant: Variant }, string>({
      query: (variantId) => `/variant/${variantId}`,
      providesTags: (result, error, id) => [{ type: "Variant", id }],
    }),

    // UPDATE variant (protected)
    updateVariant: builder.mutation<
      { variant: Variant },
      { variantId: string; updates: Partial<Variant> }
    >({
      query: ({ variantId, updates }) => ({
        url: `/variant/${variantId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { variantId }) => [
        { type: "Variant", id: variantId },
      ],
    }),

    // DELETE variant (protected)
    deleteVariant: builder.mutation<
      SuccessResponse,
      { variantId: string; productId: string }
    >({
      query: ({ variantId, productId }) => ({
        url: `/variant/${variantId}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { variantId, productId }) => [
        { type: "Variant", id: variantId },
        { type: "Product", id: productId },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductVariantsQuery,
  useAddVariantMutation,
  useGetVariantByIdQuery,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
} = productsApi;
