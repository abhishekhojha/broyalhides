// Checkout & Order Types
export interface shipping {
  name: string;
  phone: string;
  email?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  method: string;
}

export interface CheckoutRequest {
  paymentMethod?: "ONLINE" | "COD";
  couponCode?: string;
  taxRate?: number;
  shippingCost?: number;
  shipping: shipping;
  billingAddress?: Partial<shipping>;
  orderNote?: string;
  estimatedDelivery?: string;
}

export interface OrderItem {
  product: string;
  variant?: string;
  quantity: number;
  price: number;
  productTitle: string;
  productSKU: string;
  productImage?: string;
  productBrand?: string;
  productCategory?: string;
  variantSKU?: string;
  variantAttributes?: any[];
  variantImage?: string;
}

export interface Order {
  totalAmount: number;
  _id: string;
  user: string;
  items: OrderItem[];
  subtotal: number;
  taxTotal: number;
  taxRate: number;
  shippingCost: number;
  discount?: number;
  grandTotal: number;
  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentStatus?: string;
  payment: {
    method: string;
    transactionId?: string;
  };
  shipping: shipping;
  billingAddress?: Partial<shipping>;
  statusHistory: Array<{
    status: string;
    date: string;
    note?: string;
  }>;
  orderNote?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  razorpayOrderId?: string;
  couponCode?: string;
  discountAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutResponse {
  order: Order;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  key?: string;
}

export interface PaymentVerifyRequest {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  order: Order;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
