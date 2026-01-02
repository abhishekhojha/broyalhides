# API Documentation

Complete API documentation for the E-commerce Backend.

## 📚 Documentation Index

### Getting Started

- [**Complete API Reference**](./COMPLETE_API_REFERENCE.md) - Overview of all APIs, common workflows, and quick reference

### Authentication & User Management

1. [**Authentication API**](./AUTH_API.md) - User authentication, OTP, password login, profile
2. [**User Management API**](./USER_API.md) - User CRUD, role assignment (Admin)
3. [**Role & Permission API**](./ROLE_API.md) - Role management, permission system (Super Admin)

### Product Catalog

4. [**Products API**](./PRODUCT_API.md) - Products and variants CRUD
5. [**Categories API**](./CATEGORY_API.md) - Hierarchical category management
6. [**Sections API**](./MISC_APIS.md#part-1-sections-api) - Product collections/sections

### E-commerce Operations

7. [**Cart API**](./CART_API.md) - Shopping cart management
8. [**Checkout & Payment API**](./CHECKOUT_API.md) - Order checkout, payment (COD/Online)
9. [**Coupons API**](./COUPON_API.md) - Discount coupon system

### Media & Public Access

10. [**Upload API**](./MISC_APIS.md#part-2-upload-api) - Image upload to Cloudinary
11. [**Public API**](./MISC_APIS.md#part-3-public-api) - Public product/category endpoints

---

## 🚀 Quick Start

### 1. Authentication

```bash
# Send OTP
POST /api/auth/send-otp
{ "identifier": "user@example.com", "purpose": "login" }

# Verify OTP and get token
POST /api/auth/verify-otp
{ "identifier": "user@example.com", "otp": "123456" }

# Response includes JWT token
{ "accessToken": "eyJhbGciOiJIUzI1NiIs..." }
```

### 2. Browse Products

```bash
# Get all products
GET /api/public/products

# Search products
GET /api/public/products?search=wallet&category=507f...&page=1
```

### 3. Shopping Flow

```bash
# Add to cart (requires auth)
POST /api/cart/add
Authorization: Bearer <token>
{ "product": "507f...", "quantity": 2 }

# Checkout
POST /api/public/orders/checkout
Authorization: Bearer <token>
{ "paymentMethod": "COD", "shipping": {...} }
```

---

## 📊 API Statistics

| API Group      | Endpoints | Auth Required | Permission        |
| -------------- | --------- | ------------- | ----------------- |
| Authentication | 5         | Mixed         | None              |
| Products       | 10        | Mixed         | MANAGE_PRODUCTS   |
| Categories     | 5         | Mixed         | MANAGE_CATEGORIES |
| Users          | 6         | Yes           | MANAGE_USERS      |
| Roles          | 6         | Yes           | Super Admin       |
| Cart           | 5         | Yes           | None              |
| Orders         | 4         | Yes           | Mixed             |
| Checkout       | 1         | Yes           | None              |
| Payment        | 1         | Yes           | None              |
| Coupons        | 5         | Mixed         | MANAGE_COUPONS    |
| Sections       | 6         | Mixed         | MANAGE_SECTIONS   |
| Upload         | 1         | Yes           | None              |
| Public         | 8         | No            | None              |
| **Total**      | **63**    | -             | -                 |

---

## 🔑 Authentication

Most endpoints require a JWT token obtained from:

- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - Password login
- `POST /api/auth/complete-profile` - Profile completion

Include the token in requests:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔒 Permissions

The API uses role-based access control (RBAC):

### Available Permissions

- `MANAGE_PRODUCTS` - Product and variant management
- `MANAGE_ORDERS` - Order management
- `MANAGE_CATEGORIES` - Category management
- `MANAGE_COUPONS` - Coupon management
- `MANAGE_SECTIONS` - Section management
- `MANAGE_USERS` - User management

### Permission Levels

1. **Public** - No authentication required
2. **Authenticated** - Valid JWT token required
3. **Permission-based** - Specific permission required
4. **Super Admin** - Highest level (role management)

---

## 🌐 Base URLs

| API Group      | Base URL              |
| -------------- | --------------------- |
| Authentication | `/api/auth`           |
| Products       | `/api/products`       |
| Categories     | `/api/categories`     |
| Users          | `/api/users`          |
| Roles          | `/api/roles`          |
| Orders         | `/api/orders`         |
| Cart           | `/api/cart`           |
| Coupons        | `/api/coupons`        |
| Sections       | `/api/sections`       |
| Upload         | `/api/upload`         |
| Public         | `/api/public`         |
| Checkout       | `/api/public/orders`  |
| Payment        | `/api/public/payment` |
| Profile        | `/api/me`             |

---

## 💡 Common Use Cases

### Customer Journey

1. Register/Login → [Auth API](./AUTH_API.md)
2. Browse Products → [Public API](./MISC_APIS.md#part-3-public-api)
3. Add to Cart → [Cart API](./CART_API.md)
4. Apply Coupon → [Coupon API](./COUPON_API.md)
5. Checkout → [Checkout API](./CHECKOUT_API.md)
6. Verify Payment → [Payment API](./CHECKOUT_API.md#part-3-payment-verification-api)
7. Track Order → [Checkout API](./CHECKOUT_API.md#part-1-order-management-api)

### Admin Management

1. Manage Roles → [Role API](./ROLE_API.md)
2. Manage Users → [User API](./USER_API.md)
3. Manage Categories → [Category API](./CATEGORY_API.md)
4. Upload Images → [Upload API](./MISC_APIS.md#part-2-upload-api)
5. Create Products → [Product API](./PRODUCT_API.md)
6. Create Sections → [Sections API](./MISC_APIS.md#part-1-sections-api)
7. Create Coupons → [Coupon API](./COUPON_API.md)
8. Manage Orders → [Checkout API](./CHECKOUT_API.md#part-1-order-management-api)

---

## 📝 Response Formats

### Success Response

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed description"
}
```

### Paginated Response

```json
{
  "items": [...],
  "page": 1,
  "limit": 20,
  "total": 150,
  "totalPages": 8
}
```

---

## ⚠️ Error Codes

| Code | Description  |
| ---- | ------------ |
| 200  | Success      |
| 201  | Created      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |
| 409  | Conflict     |
| 500  | Server Error |

---

## 🔧 Environment Variables

Required for API functionality:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## 📞 Support

For detailed documentation on specific APIs, refer to the individual documentation files linked above.

### Documentation Files

- `AUTH_API.md` - Authentication and profile
- `PRODUCT_API.md` - Products and variants
- `CATEGORY_API.md` - Categories
- `USER_API.md` - User management
- `ROLE_API.md` - Roles and permissions
- `CART_API.md` - Shopping cart
- `CHECKOUT_API.md` - Orders, checkout, payment
- `COUPON_API.md` - Discount coupons
- `MISC_APIS.md` - Sections, upload, public APIs
- `COMPLETE_API_REFERENCE.md` - Complete overview

---

## 🚦 API Health Check

Check if the API is running:

```bash
GET /api/health
```

Response:

```
API is healthy
```

---

**Last Updated:** January 2, 2026

**API Version:** v1 (implicit)

**Total Endpoints:** 63
