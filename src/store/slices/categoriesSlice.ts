import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Category,
  CreateCategoryRequest,
  CategoriesResponse,
} from "@/types/category";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/categories`,
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
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    // 1. Get All Categories
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "",
      providesTags: (result) =>
        result
          ? [
              ...result.categories.map(({ _id }) => ({
                type: "Category" as const,
                id: _id,
              })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    // 2. Get Category by ID
    getCategoryById: builder.query<{ category: Category }, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // 3. Get Category by Slug
    getCategoryBySlug: builder.query<{ category: Category }, string>({
      query: (slug) => `/slug/${slug}`,
      providesTags: (result) =>
        result ? [{ type: "Category", id: result.category._id }] : [],
    }),

    // 3. Create Category (Protected - MANAGE_CATEGORIES)
    createCategory: builder.mutation<
      { message: string; category: Category },
      CreateCategoryRequest
    >({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // 4. Update Category (Protected)
    updateCategory: builder.mutation<
      { message: string; category: Category },
      { id: string; updates: Partial<Category> }
    >({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),

    // 5. Delete Category (Protected)
    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
