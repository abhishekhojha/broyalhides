# Product API Documentation

## Base URL

All product API endpoints are prefixed with `/api/products`

## Authentication & Authorization

- **Public Routes**: `GET /api/products`, `GET /api/products/:id`, and `GET /api/products/slug/:slug` are publicly accessible
- **Protected Routes**: All other routes require:
  - Authentication (`requireAuth` middleware)
  - `MANAGE_PRODUCTS` permission (`requirePermission` middleware)

---

## 📦 Product Endpoints

### 1. Create Product

Create a new product in the system.

**Endpoint:** `POST /api/products`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_PRODUCTS`

**Request Body:**

```json
{
  "title": "Premium Leather Wallet",
  "excerpt": "Handcrafted genuine leather wallet",
  "slug": "premium-leather-wallet",
  "description": "A beautifully crafted wallet made from premium leather...",
  "price": 4999,
  "discountPrice": 3999,
  "stock": 50,
  "images": [
    {
      "url": "https://example.com/images/wallet-front.jpg",
      "isPrimary": true
    },
    {
      "url": "https://example.com/images/wallet-back.jpg",
      "isPrimary": false
    }
  ],
  "category": "507f1f77bcf86cd799439011",
  "brand": "LeatherCraft",
  "SKU": "WALLET-001",
  "attributes": [
    {
      "key": "Material",
      "value": "Genuine Leather"
    },
    {
      "key": "Color",
      "value": "Brown"
    }
  ]
}
```

**Field Details:**

- `title` (string, required): Product name
- `excerpt` (string, optional): Short description
- `slug` (string, optional): URL-friendly identifier (auto-generated from title if not provided)
- `description` (string, optional): Detailed product description
- `price` (number, required): Product price
- `discountPrice` (number, optional): Discounted price if applicable
- `stock` (number, required): Available quantity
- `images` (array, optional): Product images with primary flag
- `category` (ObjectId, required): Reference to Category
- `brand` (string, optional): Brand name
- `SKU` (string, optional): Stock Keeping Unit (auto-generated if not provided)
- `attributes` (array, optional): Custom product attributes

**Success Response (201):**

```json
{
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Premium Leather Wallet",
    "excerpt": "Handcrafted genuine leather wallet",
    "slug": "premium-leather-wallet",
    "description": "A beautifully crafted wallet made from premium leather...",
    "price": 4999,
    "discountPrice": 3999,
    "stock": 50,
    "images": [
      {
        "url": "https://example.com/images/wallet-front.jpg",
        "isPrimary": true
      },
      {
        "url": "https://example.com/images/wallet-back.jpg",
        "isPrimary": false
      }
    ],
    "category": "507f1f77bcf86cd799439011",
    "brand": "LeatherCraft",
    "SKU": "WALLET-001",
    "variants": [],
    "attributes": [
      {
        "key": "Material",
        "value": "Genuine Leather"
      },
      {
        "key": "Color",
        "value": "Brown"
      }
    ],
    "createdAt": "2026-01-02T11:25:55.000Z",
    "updatedAt": "2026-01-02T11:25:55.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "errors": [
    "Title is required",
    "Price is required and must be a number",
    "Valid category is required"
  ]
}
```

---

### 2. Get All Products

Retrieve a paginated list of products with optional filtering and search.

**Endpoint:** `GET /api/products`

**Authentication:** Not required

**Query Parameters:**

- `search` (string, optional): Search in title, SKU, brand, or excerpt
- `category` (ObjectId, optional): Filter by category ID
- `brand` (string, optional): Filter by brand name (partial match)
- `minPrice` (number, optional): Minimum price filter
- `maxPrice` (number, optional): Maximum price filter
- `role` (string, optional): Role-based filtering (e.g., 'customer' shows only in-stock products)
- `page` (number, optional, default: 1): Page number
- `limit` (number, optional, default: 10): Items per page

**Example Request:**

```
GET /api/products?search=wallet&category=507f1f77bcf86cd799439011&minPrice=1000&maxPrice=5000&page=1&limit=10
```

**Success Response (200):**

```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Premium Leather Wallet",
      "excerpt": "Handcrafted genuine leather wallet",
      "slug": "premium-leather-wallet",
      "description": "A beautifully crafted wallet made from premium leather...",
      "price": 4999,
      "discountPrice": 3999,
      "stock": 50,
      "images": [
        {
          "url": "https://example.com/images/wallet-front.jpg",
          "isPrimary": true
        }
      ],
      "category": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Accessories",
        "slug": "accessories"
      },
      "brand": "LeatherCraft",
      "SKU": "WALLET-001",
      "variants": [],
      "attributes": [
        {
          "key": "Material",
          "value": "Genuine Leather"
        }
      ],
      "createdAt": "2026-01-02T11:25:55.000Z",
      "updatedAt": "2026-01-02T11:25:55.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

**Response Structure:**

- `products` (array): List of product objects (populated with category and variants)
- `total` (number): Total number of products matching the filter
- `page` (number): Current page number
- `totalPages` (number): Total number of pages

---

### 3. Get Product by ID

Retrieve a single product by its ID.

**Endpoint:** `GET /api/products/:id`

**Authentication:** Not required

**URL Parameters:**

- `id` (ObjectId, required): Product ID

**Example Request:**

```
GET /api/products/507f1f77bcf86cd799439012
```

**Success Response (200):**

```json
{
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Premium Leather Wallet",
    "excerpt": "Handcrafted genuine leather wallet",
    "slug": "premium-leather-wallet",
    "description": "A beautifully crafted wallet made from premium leather...",
    "price": 4999,
    "discountPrice": 3999,
    "stock": 50,
    "images": [
      {
        "url": "https://example.com/images/wallet-front.jpg",
        "isPrimary": true
      },
      {
        "url": "https://example.com/images/wallet-back.jpg",
        "isPrimary": false
      }
    ],
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Accessories",
      "slug": "accessories"
    },
    "brand": "LeatherCraft",
    "SKU": "WALLET-001",
    "variants": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "product": "507f1f77bcf86cd799439012",
        "attributes": [
          {
            "key": "Color",
            "value": "Black"
          }
        ],
        "price": 4999,
        "stock": 20,
        "SKU": "WALLET-001-BLK"
      }
    ],
    "attributes": [
      {
        "key": "Material",
        "value": "Genuine Leather"
      }
    ],
    "createdAt": "2026-01-02T11:25:55.000Z",
    "updatedAt": "2026-01-02T11:25:55.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "error": "Product not found"
}
```

---

### 4. Get Product by Slug

Retrieve a single product by its URL-friendly slug.

**Endpoint:** `GET /api/products/slug/:slug`

**Authentication:** Not required

**URL Parameters:**

- `slug` (string, required): URL-friendly product identifier

**Example Request:**

```
GET /api/products/slug/premium-leather-wallet
```

**Success Response (200):**

```json
{
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Premium Leather Wallet",
    "excerpt": "Handcrafted genuine leather wallet",
    "slug": "premium-leather-wallet",
    "description": "A beautifully crafted wallet made from premium leather...",
    "price": 4999,
    "discountPrice": 3999,
    "stock": 50,
    "images": [
      {
        "url": "https://example.com/images/wallet-front.jpg",
        "isPrimary": true
      }
    ],
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Accessories",
      "slug": "accessories"
    },
    "brand": "LeatherCraft",
    "SKU": "WALLET-001",
    "variants": [],
    "attributes": [
      {
        "key": "Material",
        "value": "Genuine Leather"
      }
    ],
    "createdAt": "2026-01-02T11:25:55.000Z",
    "updatedAt": "2026-01-02T11:25:55.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "error": "Product not found"
}
```

**Notes:**

- Use this endpoint for SEO-friendly URLs (e.g., `/products/premium-leather-wallet`)
- Slug must match exactly (case-sensitive, lowercase)
- Returns the same populated data as Get Product by ID

---

### 5. Update Product

Update an existing product.

**Endpoint:** `PUT /api/products/:id`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_PRODUCTS`

**URL Parameters:**

- `id` (ObjectId, required): Product ID

**Request Body:** (Same structure as Create Product - all fields optional for update)

```json
{
  "title": "Premium Leather Wallet - Updated",
  "price": 5499,
  "stock": 45
}
```

**Success Response (200):**

```json
{
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Premium Leather Wallet - Updated",
    "price": 5499,
    "stock": 45,
    ...
  }
}
```

**Error Response (404):**

```json
{
  "error": "Product not found"
}
```

---

### 6. Delete Product

Delete a product and all its variants.

**Endpoint:** `DELETE /api/products/:id`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_PRODUCTS`

**URL Parameters:**

- `id` (ObjectId, required): Product ID

**Success Response (200):**

```json
{
  "success": true
}
```

**Error Response (404):**

```json
{
  "error": "Product not found"
}
```

---

## 🎨 Product Variant Endpoints

### 7. Add Variant to Product

Create a new variant for an existing product.

**Endpoint:** `POST /api/products/:productId/variant`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_PRODUCTS`

**URL Parameters:**

- `productId` (ObjectId, required): Parent product ID

**Request Body:**

```json
{
  "attributes": [
    {
      "key": "Color",
      "value": "Black"
    },
    {
      "key": "Size",
      "value": "Large"
    }
  ],
  "price": 5499,
  "discountPrice": 4499,
  "stock": 30,
  "SKU": "WALLET-001-BLK-LG",
  "image": "https://example.com/images/wallet-black.jpg"
}
```

**Field Details:**

- `attributes` (array, required): Variant-specific attributes (e.g., color, size)
- `price` (number, required): Variant price (must be positive)
- `discountPrice` (number, optional): Discounted price
- `stock` (number, required): Available quantity (non-negative)
- `SKU` (string, optional): Unique SKU (auto-generated if not provided)
- `image` (string, optional): Variant-specific image URL

**Success Response (201):**

```json
{
  "variant": {
    "_id": "507f1f77bcf86cd799439013",
    "product": "507f1f77bcf86cd799439012",
    "attributes": [
      {
        "key": "Color",
        "value": "Black"
      },
      {
        "key": "Size",
        "value": "Large"
      }
    ],
    "price": 5499,
    "discountPrice": 4499,
    "stock": 30,
    "SKU": "WALLET-001-BLK-LG",
    "image": "https://example.com/images/wallet-black.jpg",
    "createdAt": "2026-01-02T11:30:00.000Z",
    "updatedAt": "2026-01-02T11:30:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "errors": [
    "Variant attributes are required",
    "Variant price must be a positive number",
    "Variant stock must be a non-negative number"
  ]
}
```

---

### 8. Get All Variants for a Product

Retrieve all variants of a specific product.

**Endpoint:** `GET /api/products/:productId/variants`

**Authentication:** Not required

**URL Parameters:**

- `productId` (ObjectId, required): Product ID

**Example Request:**

```
GET /api/products/507f1f77bcf86cd799439012/variants
```

**Success Response (200):**

```json
{
  "variants": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "product": "507f1f77bcf86cd799439012",
      "attributes": [
        {
          "key": "Color",
          "value": "Black"
        }
      ],
      "price": 5499,
      "discountPrice": 4499,
      "stock": 30,
      "SKU": "WALLET-001-BLK",
      "image": "https://example.com/images/wallet-black.jpg",
      "createdAt": "2026-01-02T11:30:00.000Z",
      "updatedAt": "2026-01-02T11:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "product": "507f1f77bcf86cd799439012",
      "attributes": [
        {
          "key": "Color",
          "value": "Brown"
        }
      ],
      "price": 4999,
      "stock": 25,
      "SKU": "WALLET-001-BRN",
      "createdAt": "2026-01-02T11:31:00.000Z",
      "updatedAt": "2026-01-02T11:31:00.000Z"
    }
  ]
}
```

**Error Response (400):**

```json
{
  "error": "Invalid product ID"
}
```

---

### 9. Get Variant by ID

Retrieve a single variant by its ID.

**Endpoint:** `GET /api/products/variant/:variantId`

**Authentication:** Not required

**URL Parameters:**

- `variantId` (ObjectId, required): Variant ID

**Example Request:**

```
GET /api/products/variant/507f1f77bcf86cd799439013
```

**Success Response (200):**

```json
{
  "variant": {
    "_id": "507f1f77bcf86cd799439013",
    "product": "507f1f77bcf86cd799439012",
    "attributes": [
      {
        "key": "Color",
        "value": "Black"
      }
    ],
    "price": 5499,
    "discountPrice": 4499,
    "stock": 30,
    "SKU": "WALLET-001-BLK",
    "image": "https://example.com/images/wallet-black.jpg",
    "createdAt": "2026-01-02T11:30:00.000Z",
    "updatedAt": "2026-01-02T11:30:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "error": "Variant not found"
}
```

---

### 10. Update Variant

Update an existing variant.

**Endpoint:** `PUT /api/products/variant/:variantId`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_PRODUCTS`

**URL Parameters:**

- `variantId` (ObjectId, required): Variant ID

**Request Body:** (All fields optional)

```json
{
  "price": 5999,
  "stock": 35,
  "discountPrice": 4999
}
```

**Success Response (200):**

```json
{
  "variant": {
    "_id": "507f1f77bcf86cd799439013",
    "product": "507f1f77bcf86cd799439012",
    "attributes": [
      {
        "key": "Color",
        "value": "Black"
      }
    ],
    "price": 5999,
    "discountPrice": 4999,
    "stock": 35,
    "SKU": "WALLET-001-BLK",
    "image": "https://example.com/images/wallet-black.jpg",
    "createdAt": "2026-01-02T11:30:00.000Z",
    "updatedAt": "2026-01-02T11:35:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "error": "Variant not found"
}
```

---

### 11. Delete Variant

Delete a variant and remove its reference from the parent product.

**Endpoint:** `DELETE /api/products/variant/:variantId/:productId`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_PRODUCTS`

**URL Parameters:**

- `variantId` (ObjectId, required): Variant ID
- `productId` (ObjectId, required): Parent product ID

**Example Request:**

```
DELETE /api/products/variant/507f1f77bcf86cd799439013/507f1f77bcf86cd799439012
```

**Success Response (200):**

```json
{
  "success": true
}
```

**Error Response (404):**

```json
{
  "error": "Variant not found"
}
```

---

## 📝 Data Models

### Product Model

```typescript
{
  _id: ObjectId,
  title: string,              // Product name
  excerpt?: string,           // Short description
  slug: string,               // URL-friendly identifier (unique)
  description?: string,       // Full description
  price: number,              // Base price
  discountPrice?: number,     // Discounted price
  stock: number,              // Available quantity
  images: [
    {
      url: string,            // Image URL
      isPrimary: boolean      // Is primary product image
    }
  ],
  category: ObjectId,         // Reference to Category
  brand?: string,             // Brand name
  SKU: string,                // Stock Keeping Unit (unique)
  variants?: [ObjectId],      // References to Variant models
  attributes?: [
    {
      key: string,            // Attribute name
      value: string           // Attribute value
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Variant Model

```typescript
{
  _id: ObjectId,
  product: ObjectId,          // Reference to parent Product
  attributes: [
    {
      key: string,            // Variant attribute name (e.g., "Color")
      value: string           // Variant attribute value (e.g., "Black")
    }
  ],
  price: number,              // Variant-specific price
  discountPrice?: number,     // Variant-specific discount
  stock: number,              // Variant-specific stock
  SKU?: string,               // Variant-specific SKU
  image?: string,             // Variant-specific image URL
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Authorization Header Format

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## ⚠️ Error Codes

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| 200         | Success                              |
| 201         | Created                              |
| 400         | Bad Request (validation errors)      |
| 401         | Unauthorized (missing/invalid token) |
| 403         | Forbidden (insufficient permissions) |
| 404         | Not Found                            |
| 500         | Internal Server Error                |

---

## 💡 Usage Examples

### Example 1: Create a Product with Variants

```javascript
// Step 1: Create the base product
const productResponse = await fetch("/api/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_TOKEN",
  },
  body: JSON.stringify({
    title: "Premium T-Shirt",
    price: 1999,
    stock: 100,
    category: "507f1f77bcf86cd799439011",
    brand: "FashionCo",
    images: [{ url: "https://example.com/tshirt.jpg", isPrimary: true }],
  }),
});

const { product } = await productResponse.json();

// Step 2: Add variants for different sizes and colors
const variantResponse = await fetch(`/api/products/${product._id}/variant`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_TOKEN",
  },
  body: JSON.stringify({
    attributes: [
      { key: "Size", value: "Medium" },
      { key: "Color", value: "Blue" },
    ],
    price: 1999,
    stock: 25,
  }),
});
```

### Example 2: Search and Filter Products

```javascript
// Search for leather products priced between $30-$100
const response = await fetch(
  "/api/products?search=leather&minPrice=3000&maxPrice=10000&page=1&limit=20"
);

const { products, total, totalPages } = await response.json();
console.log(`Found ${total} products across ${totalPages} pages`);
```

### Example 3: Get Product with All Details

```javascript
// Get complete product information including category and variants
const response = await fetch("/api/products/507f1f77bcf86cd799439012");
const { product } = await response.json();

// Product object includes:
// - Populated category object
// - Array of variant objects
// - All product attributes and images
```

---

## 🔄 Auto-Generated Fields

The following fields are automatically generated if not provided:

1. **SKU**: Format `SKU-{timestamp}-{random}`

   - Example: `SKU-1704201955000-7534`

2. **Slug**: Generated from product title

   - Input: "Premium Leather Wallet"
   - Output: `premium-leather-wallet`
   - Ensures uniqueness by appending numbers if needed

3. **Variant SKU**: Format `VSKU-{timestamp}-{random}`
   - Example: `VSKU-1704201955000-7534`

---

## 📌 Notes

1. **Population**: GET endpoints automatically populate `category` and `variants` references
2. **Cascade Delete**: Deleting a product also deletes all associated variants
3. **Slug Uniqueness**: The system ensures slug uniqueness by appending numbers
4. **Search**: Search is case-insensitive and searches across title, SKU, brand, and excerpt
5. **Pagination**: Default limit is 10 items per page
6. **Role-Based Filtering**: When `role=customer` is passed, only in-stock products are returned
