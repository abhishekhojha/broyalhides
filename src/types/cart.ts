import type { Product, Variant } from "./product";

// Cart Types
export interface CartItem {
  product: Product | string;
  variant?: Variant | string | null;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface AddToCartRequest {
  product: string;
  variant?: string | null;
  quantity: number;
}

export interface UpdateCartRequest {
  product: string;
  variant?: string | null;
  quantity: number;
}

export interface RemoveItemRequest {
  product: string;
  variant?: string | null;
}

export interface SyncCartRequest {
  items: CartItem[];
}

export interface CartResponse {
  success: boolean;
  items: CartItem[];
}
