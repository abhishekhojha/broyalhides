// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: Category | string | null;
  description?: string;
  image?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  parent?: string | null;
  description?: string;
  image?: string;
  status?: "active" | "inactive";
}

export interface CategoriesResponse {
  categories: Category[];
}
