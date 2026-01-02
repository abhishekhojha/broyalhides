# Complete API Reference

Comprehensive API documentation for the E-commerce Backend.

## 📚 API Documentation Index

This e-commerce backend provides the following API groups:

### Core APIs

1. [**Authentication API**](./AUTH_API.md) - User authentication and profile management

   - OTP-based login/registration
   - Password-based login
   - Profile completion
   - Get current user profile

2. [**Products API**](./PRODUCT_API.md) - Product and variant management

   - CRUD operations for products
   - Product variants management
   - Search and filtering

3. [**Categories API**](./CATEGORY_API.md) - Product categorization

   - Hierarchical category structure
   - Category CRUD operations

4. [**Users API**](./USER_API.md) - User management (Admin)

   - User CRUD operations
   - Role assignment
   - Search and filtering

5. [**Roles & Permissions API**](./ROLE_API.md) - Access control
   - Role management
   - Permission system

### E-commerce Features

6. [Cart API](./CART_API.md) - Shopping cart management
7. [Orders API](./ORDER_API.md) - Order processing and management
8. [Coupons API](./COUPON_API.md) - Discount coupon system
9. [Checkout & Payment API](./CHECKOUT_API.md) - Order placement and payment

### Content & Media

10. [Sections API](./SECTION_API.md) - Product sections/collections
11. [Upload API](./UPLOAD_API.md) - Image upload to Cloudinary
12. [Public API](./PUBLIC_API.md) - Public-facing endpoints

---

## 🔑 Authentication

Most endpoints require authentication via JWT token:

```
Authorization: Bearer <your_jwt_token>
```

### Token Acquisition

Get your JWT token from:

- `POST /api/auth/verify-otp` - After OTP verification
- `POST /api/auth/login` - Password-based login
- `POST /api/auth/complete-profile` - After profile completion

---

## 🌐 Base URLs

All API endpoints are prefixed with their respective base paths:

| API Group                  | Base URL              |
| -------------------------- | --------------------- |
| Authentication             | `/api/auth`           |
| Products                   | `/api/products`       |
| Categories                 | `/api/categories`     |
| Users                      | `/api/users`          |
| Roles                      | `/api/roles`          |
| Orders                     | `/api/orders`         |
| Cart                       | `/api/cart`           |
| Coupons                    | `/api/coupons`        |
| Sections                   | `/api/sections`       |
| Upload                     | `/api/upload`         |
| Public Products/Categories | `/api/public`         |
| Public Checkout            | `/api/public/orders`  |
| Public Payment             | `/api/public/payment` |
| Profile                    | `/api/me`             |

---

## 📋 Quick Reference

### Public Endpoints (No Auth Required)

- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - Password login
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Get category
- `GET /api/public/*` - All public routes
- `POST /api/coupons/apply` - Apply coupon code

### Authenticated Endpoints (Auth Required)

- `GET /api/me` - Get current user profile
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `POST /api/public/orders/checkout` - Checkout
- `POST /api/public/payment/verify` - Verify payment
- `GET /api/orders` - Get user orders

### Admin Endpoints (Auth + Permission Required)

- `POST /api/products` - Create product (MANAGE_PRODUCTS)
- `POST /api/categories` - Create category (MANAGE_CATEGORIES)
- `POST /api/users` - Create user (MANAGE_USERS)
- `POST /api/roles` - Create role (Super Admin)
- `POST /api/coupons` - Create coupon (MANAGE_COUPONS)
- `POST /api/sections` - Create section (MANAGE_SECTIONS)
- `DELETE /api/orders/:id` - Delete order (MANAGE_ORDERS)

---

## 🔒 Permission System

The API uses role-based access control (RBAC):

### Available Permissions

- `MANAGE_PRODUCTS` - Product and variant management
- `MANAGE_ORDERS` - Order management
- `MANAGE_CATEGORIES` - Category management
- `MANAGE_COUPONS` - Coupon management
- `MANAGE_SECTIONS` - Section management
- `MANAGE_USERS` - User management (future)

### Super Admin

All role management endpoints require Super Admin privileges.

---

## ⚠️ Common Error Codes

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| 200         | Success                              |
| 201         | Created                              |
| 400         | Bad Request (validation errors)      |
| 401         | Unauthorized (missing/invalid token) |
| 403         | Forbidden (insufficient permissions) |
| 404         | Not Found                            |
| 409         | Conflict (duplicate resource)        |
| 500         | Internal Server Error                |

---

## 📊 Standard Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ...},
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

### Pagination Response

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

## 🚀 Getting Started

1. **Register/Login** using OTP or password
2. **Get JWT token** from login response
3. **Include token** in Authorization header for protected endpoints
4. **Browse products** using public endpoints
5. **Add to cart** and **checkout** when ready
6. **Manage orders** through order endpoints

---

## 💡 Common Workflows

### Customer Purchase Flow

```
1. Browse Products → GET /api/public/products
2. View Product → GET /api/public/products/:id
3. Add to Cart → POST /api/cart/add
4. Apply Coupon → POST /api/coupons/apply
5. Checkout → POST /api/public/orders/checkout
6. Verify Payment → POST /api/public/payment/verify (for online payment)
7. View Orders → GET /api/orders
```

### Admin Product Management

```
1. Login → POST /api/auth/login
2. Create Category → POST /api/categories
3. Upload Images → POST /api/upload
4. Create Product → POST /api/products
5. Add Variants → POST /api/products/:id/variant
6. Create Section → POST /api/sections
7. Create Coupon → POST /api/coupons
```

---

## 📱 API Versioning

Currently using **v1** (implicit). No version prefix in URLs.

---

## 🔧 Environment Setup

Required environment variables:

- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `RAZORPAY_KEY_ID` - Razorpay API key
- `RAZORPAY_KEY_SECRET` - Razorpay secret
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

---

## 📞 Support

For API support, refer to individual API documentation linked above.
