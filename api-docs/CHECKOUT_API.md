# Orders, Checkout & Payment API Documentation

This document covers three related APIs:

1. Order Management (`/api/orders`) - Admin order management
2. Checkout (`/api/public/orders`) - Customer checkout
3. Payment Verification (`/api/public/payment`) - Payment confirmation

---

## 📦 Part 1: Order Management API

**Base URL:** `/api/orders`

**Authentication:** All endpoints require authentication

### 1. Get All Orders

**Endpoint:** `GET /api/orders`

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, optional): Filter by order status

**Success Response:**

```json
{
  "orders": [
    {
      "_id": "order123",
      "user": {
        "_id": "user123",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [
        {
          "product": "prod123",
          "variant": null,
          "quantity": 2,
          "price": 4999,
          "productTitle": "Premium Wallet",
          "productSKU": "WALLET-001"
        }
      ],
      "subtotal": 9998,
      "taxTotal": 1799.64,
      "taxRate": 0.18,
      "shippingCost": 100,
      "discount": 500,
      "grandTotal": 11397.64,
      "status": "processing",
      "paymentStatus": "paid",
      "payment": {
        "method": "razorpay",
        "transactionId": "pay_123456"
      },
      "shipping": {
        "name": "John Doe",
        "phone": "+919876543210",
        "email": "john@example.com",
        "street": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zip": "400001",
        "country": "India",
        "method": "Standard Delivery"
      },
      "statusHistory": [
        {
          "status": "paid",
          "date": "2026-01-02T12:00:00.000Z"
        }
      ],
      "createdAt": "2026-01-02T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15
  }
}
```

### 2. Get Order by ID

**Endpoint:** `GET /api/orders/:id`

**Success Response:**

```json
{
  "order": {
    "_id": "order123",
    "user": {...},
    "items": [{...}],  // Items populated with full product & variant details
    ...
  }
}
```

### 3. Update Order Status

**Endpoint:** `PUT /api/orders/:id/status`

**Request Body:**

```json
{
  "status": "shipped",
  "paymentStatus": "paid",
  "trackingNumber": "TRK123456",
  "carrier": "FedEx",
  "estimatedDelivery": "2026-01-10T00:00:00.000Z",
  "note": "Order shipped"
}
```

**Order Status Values:**

- `pending` - Order created, awaiting payment
- `paid` - Payment confirmed (processing, not shipped yet)
- `shipped` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled

**Success Response:**

```json
{
  "order": {...}  // Updated order with new status in statusHistory
}
```

**Notes:**

- Cancelling an order restores stock automatically
- Status history is automatically tracked
- All fields are optional except the status you want to change

### 4. Delete Order

**Endpoint:** `DELETE /api/orders/:id`

**Permission:** `MANAGE_ORDERS`

**Success Response:**

```json
{
  "success": true
}
```

**Notes:**

- Restores stock if order wasn't cancelled
- Permanent deletion (no soft delete)

---

## 🛒 Part 2: Checkout API

**Base URL:** `/api/public/orders`

**Authentication:** Required

### Checkout Order

**Endpoint:** `POST /api/public/orders/checkout`

**Request Body:**

```json
{
  "paymentMethod": "ONLINE",
  "couponCode": "SUMMER2024",
  "taxRate": 0.18,
  "shippingCost": 100,
  "shipping": {
    "name": "John Doe",
    "phone": "+919876543210",
    "email": "john@example.com",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zip": "400001",
    "country": "India",
    "method": "Standard Delivery"
  },
  "billingAddress": {
    "name": "John Doe",
    "phone": "+919876543210",
    "street": "456 Business Ave",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zip": "400002",
    "country": "India"
  },
  "orderNote": "Please deliver between 2-5 PM",
  "estimatedDelivery": "2026-01-10T00:00:00.000Z"
}
```

**Field Details:**

- `paymentMethod` (string, optional, default: "ONLINE"): `"ONLINE"` or `"COD"`
- `couponCode` (string, optional): Coupon code to apply
- `taxRate` (number, optional, default: 0.18): Tax rate (18% GST)
- `shippingCost` (number, optional, default: 0): Shipping cost
- `shipping` (object, required): Shipping details
- `billingAddress` (object, optional): Billing address (if different from shipping)
- `orderNote` (string, optional): Special instructions
- `estimatedDelivery` (Date, optional): Estimated delivery date

**Success Response for COD:**

```json
{
  "order": {
    "_id": "order123",
    "user": "user123",
    "items": [...],
    "subtotal": 9998,
    "taxTotal": 1799.64,
    "shippingCost": 100,
    "discount": 500,
    "grandTotal": 11397.64,
    "status": "processing",
    "paymentStatus": "pending",
    "payment": {
      "method": "COD",
      "transactionId": ""
    },
    "couponCode": "SUMMER2024",
    "discountAmount": 500,
    ...
  }
}
```

**Success Response for ONLINE Payment:**

```json
{
  "order": {...},
  "razorpayOrderId": "order_razorpay123",
  "amount": 1139764,  // Amount in paise (₹11,397.64 * 100)
  "currency": "INR",
  "key": "rzp_test_XXXXXXXXXX"  // Razorpay key for frontend
}
```

**Workflow Differences:**

**COD:**

1. Stock is decremented immediately
2. Order status: `processing`
3. Payment status: `pending`
4. Cart is cleared
5. Returns order directly

**ONLINE:**

1. Stock is NOT decremented
2. Order status: `pending`
3. Payment status: `pending`
4. Cart is NOT cleared
5. Returns Razorpay details for frontend payment

**Error Responses:**

- `400 Cart is empty`
- `400 Product not found`
- `400 Variant out of stock`
- `400 Invalid coupon code`
- `400 Coupon has expired`
- `400 Minimum order value required`

---

## 💳 Part 3: Payment Verification API

**Base URL:** `/api/public/payment`

**Authentication:** Required

### Verify Payment

**Endpoint:** `POST /api/public/payment/verify`

**Request Body:**

```json
{
  "razorpay_order_id": "order_razorpay123",
  "razorpay_payment_id": "pay_razorpay456",
  "razorpay_signature": "signature_hash"
}
```

**Success Response:**

```json
{
  "success": true,
  "order": {
    "_id": "order123",
    "status": "paid",
    "paymentStatus": "paid",
    "payment": {
      "method": "razorpay",
      "transactionId": "pay_razorpay456"
    },
    ...
  }
}
```

**Process:**

1. Verifies Razorpay signature
2. Finds order by `razorpayOrderId`
3. Decrements stock for all items
4. Updates order status to `paid`
5. Stores transaction ID
6. Clears user's cart
7. Adds status history entry

**Error Responses:**

- `400 Invalid signature`
- `404 Order not found`
- `400 Product out of stock` (if stock changed since checkout)

---

## 📝 Data Models

### Order Model

```typescript
{
  _id: ObjectId,
  user: ObjectId,  // Ref: User
  items: [{
    product: ObjectId,
    variant?: ObjectId,
    quantity: number,
    price: number,
    // Product snapshot
    productTitle: string,
    productSKU: string,
    productImage?: string,
    productBrand?: string,
    productCategory?: string,
    // Variant snapshot
    variantSKU?: string,
    variantAttributes?: any[],
    variantImage?: string
  }],
  subtotal: number,
  taxTotal: number,
  taxRate: number,
  taxBreakdown?: { GST: number },
  shippingCost: number,
  discount?: number,
  grandTotal: number,
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled",
  payment: {
    method: string,
    transactionId?: string
  },
  paymentStatus?: string,
  shipping: {
    name: string,
    phone: string,
    email?: string,
    street?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
    method: string
  },
  billingAddress?: {...},
  statusHistory: [{
    status: string,
    date: Date,
    note?: string
  }],
  orderNote?: string,
  cancellationReason?: string,
  trackingNumber?: string,
  carrier?: string,
  estimatedDelivery?: Date,
  razorpayOrderId?: string,
  coupon?: ObjectId,
  couponCode?: string,
  discountAmount?: number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 💡 Complete Checkout Flow Example

```javascript
// 1. Checkout with COD
const checkoutCOD = async (token, shippingDetails) => {
  const response = await fetch("/api/public/orders/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      paymentMethod: "COD",
      shipping: shippingDetails,
      taxRate: 0.18,
      shippingCost: 100,
    }),
  });

  const { order } = await response.json();
  console.log("COD Order created:", order._id);
  return order;
};

// 2. Checkout with Online Payment
const checkoutOnline = async (token, shippingDetails) => {
  const response = await fetch("/api/public/orders/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      paymentMethod: "ONLINE",
      shipping: shippingDetails,
      couponCode: "SUMMER2024",
      taxRate: 0.18,
      shippingCost: 100,
    }),
  });

  const { order, razorpayOrderId, amount, currency, key } =
    await response.json();

  // 3. Initialize Razorpay
  const options = {
    key: key,
    amount: amount,
    currency: currency,
    name: "Your Store",
    order_id: razorpayOrderId,
    handler: async function (response) {
      // 4. Verify payment
      await verifyPayment(token, response);
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
};

// 5. Verify Payment
const verifyPayment = async (token, razorpayResponse) => {
  const response = await fetch("/api/public/payment/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    }),
  });

  const { success, order } = await response.json();
  if (success) {
    console.log("Payment successful! Order:", order._id);
    // Redirect to success page
  }
};
```

---

## ⚠️ Important Notes

1. **Stock Management**:

   - COD: Stock decremented at checkout
   - Online: Stock decremented after payment verification

2. **Cart Clearing**:

   - COD: Cart cleared at checkout
   - Online: Cart cleared after payment verification

3. **Order Status Flow**:

   - COD: `pending` → `processing` → `shipped` → `delivered`
   - Online: `pending` → `paid` → `shipped` → `delivered`

4. **Product Snapshot**: Product details are stored in order items for history

5. **Transactions**: Uses MongoDB transactions for atomicity

6. **Coupon Usage**: Incremented during checkout, not during apply

7. **Tax Calculation**: `taxTotal = subtotal * taxRate`

8. **Grand Total**: `subtotal + taxTotal + shippingCost - discount`
