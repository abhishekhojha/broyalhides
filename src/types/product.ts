export interface ProductImage {
  url: string;
  isPrimary: boolean;
}

export interface ProductAttribute {
  key: string;
  value: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  title: string;
  excerpt?: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: ProductImage[];
  category: string | Category;
  brand?: string;
  SKU: string;
  variants?: string[] | Variant[];
  attributes?: ProductAttribute[];
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  _id: string;
  product: string;
  attributes: ProductAttribute[];
  price: number;
  discountPrice?: number;
  stock: number;
  SKU?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  role?: string;
  page?: number;
  limit?: number;
}

export interface CreateProductRequest {
  title: string;
  excerpt?: string;
  slug?: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images?: ProductImage[];
  category: string;
  brand?: string;
  SKU?: string;
  attributes?: ProductAttribute[];
}

export interface CreateVariantRequest {
  attributes: ProductAttribute[];
  price: number;
  discountPrice?: number;
  stock: number;
  SKU?: string;
  image?: string;
}
