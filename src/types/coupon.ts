// Coupon Types
export interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyCouponRequest {
  code: string;
  orderValue: number;
}

export interface ApplyCouponResponse {
  success: boolean;
  discountAmount: number;
  couponCode: string;
  message?: string;
}

export interface CouponsResponse {
  success: boolean;
  coupons: Coupon[];
  total: number;
  page: number;
  totalPages: number;
}
