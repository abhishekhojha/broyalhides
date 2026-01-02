# Coupon API Documentation

## Base URL

Coupon endpoints are prefixed with `/api/coupons`

## Authentication & Authorization

- **Public Routes**: `POST /api/coupons/apply` is publicly accessible
- **Protected Routes**: All other routes require:
  - Authentication (`requireAuth`)
  - `MANAGE_COUPONS` permission

---

## 🎫 Coupon Endpoints

### 1. Create Coupon

Create a new discount coupon (Admin).

**Endpoint:** `POST /api/coupons`

**Authentication:** Required + `MANAGE_COUPONS` permission

**Request Body:**

```json
{
  "code": "SUMMER2024",
  "discountType": "percentage",
  "discountValue": 20,
  "minOrderValue": 1000,
  "maxDiscount": 500,
  "expiryDate": "2024-12-31T23:59:59.000Z",
  "usageLimit": 100
}
```

**Field Details:**

- `code` (string, required): Unique coupon code (auto-uppercase)
- `discountType` (string, required): `"percentage"` or `"fixed"`
- `discountValue` (number, required): Percentage (0-100) or fixed amount
- `minOrderValue` (number, optional, default: 0): Minimum order value
- `maxDiscount` (number, optional): Max discount for percentage type
- `expiryDate` (Date, required): Expiration date
- `usageLimit` (number, optional, default: 100): Total usage limit

**Success Response (201):**

```json
{
  "success": true,
  "coupon": {
    "_id": "507f1f77bcf86cd799439011",
    "code": "SUMMER2024",
    "discountType": "percentage",
    "discountValue": 20,
    "minOrderValue": 1000,
    "maxDiscount": 500,
    "expiryDate": "2024-12-31T23:59:59.000Z",
    "usageLimit": 100,
    "usedCount": 0,
    "isActive": true,
    "createdAt": "2026-01-02T12:00:00.000Z",
    "updatedAt": "2026-01-02T12:00:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Coupon code already exists"
}
```

---

### 2. Get All Coupons

Retrieve all coupons with pagination and filtering (Admin).

**Endpoint:** `GET /api/coupons`

**Authentication:** Required + `MANAGE_COUPONS` permission

**Query Parameters:**

- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)
- `search` (string, optional): Search by code
- `isActive` (boolean, optional): Filter by active status

**Success Response (200):**

```json
{
  "success": true,
  "coupons": [...],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

---

### 3. Update Coupon

Update an existing coupon (Admin).

**Endpoint:** `PUT /api/coupons/:id`

**Authentication:** Required + `MANAGE_COUPONS` permission

**Request Body:** (All fields optional)

```json
{
  "discountValue": 25,
  "expiryDate": "2025-01-31T23:59:59.000Z",
  "isActive": false
}
```

**Success Response (200):**

```json
{
  "success": true,
  "coupon": {...}
}
```

---

### 4. Delete Coupon

Delete a coupon (Admin).

**Endpoint:** `DELETE /api/coupons/:id`

**Authentication:** Required + `MANAGE_COUPONS` permission

**Success Response (200):**

```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

---

### 5. Apply Coupon

Validate and calculate discount for a coupon (Public).

**Endpoint:** `POST /api/coupons/apply`

**Authentication:** Not required

**Request Body:**

```json
{
  "code": "SUMMER2024",
  "orderValue": 5000
}
```

**Success Response (200):**

```json
{
  "success": true,
  "discountAmount": 500,
  "couponCode": "SUMMER2024"
}
```

**Error Responses:**

_Invalid Code (404):_

```json
{
  "success": false,
  "message": "Invalid coupon code"
}
```

_Inactive (400):_

```json
{
  "success": false,
  "message": "Coupon is inactive"
}
```

_Expired (400):_

```json
{
  "success": false,
  "message": "Coupon has expired"
}
```

_Usage Limit Exceeded (400):_

```json
{
  "success": false,
  "message": "Coupon usage limit exceeded"
}
```

_Minimum Order Value (400):_

```json
{
  "success": false,
  "message": "Minimum order value of 1000 required"
}
```

---

## 📝 Data Model

```typescript
{
  _id: ObjectId,
  code: string,                      // Unique, uppercase
  discountType: "percentage" | "fixed",
  discountValue: number,             // Percentage or fixed amount
  minOrderValue: number,             // Min order value (default: 0)
  maxDiscount?: number,              // Max discount for percentage
  expiryDate: Date,
  usageLimit: number,                // Total usage limit (default: 100)
  usedCount: number,                 // Current usage count (default: 0)
  isActive: boolean,                 // Active status (default: true)
  createdAt: Date,
  updatedAt: Date
}
```

---

## 💡 Usage Examples

```javascript
// Apply coupon
const applyCoupon = async (code, orderValue) => {
  const response = await fetch("/api/coupons/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, orderValue }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};

// Usage
try {
  const result = await applyCoupon("SUMMER2024", 5000);
  console.log(`Discount: ₹${result.discountAmount}`);
  console.log(`Final: ₹${5000 - result.discountAmount}`);
} catch (error) {
  console.error(error.message);
}
```

---

## ⚠️ Important Notes

1. **Auto-Uppercase**: Coupon codes are automatically converted to uppercase
2. **Discount Calculation**:
   - Fixed: Direct discount value
   - Percentage: `(orderValue * discountValue) / 100`, capped at `maxDiscount`
3. **Usage Tracking**: `usedCount` is incremented during checkout, not during apply
4. **Expiry**: Validated against current date
5. **No User Tracking**: System doesn't track per-user usage (same user can use multiple times)
