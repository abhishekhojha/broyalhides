# Sections, Upload & Public API Documentation

This document covers three different APIs:

1. **Sections API** - Product collections/sections management (`/api/sections`)
2. **Upload API** - Image upload to Cloudinary (`/api/upload`)
3. **Public API** - Public-facing product and category endpoints (`/api/public`)

---

## 📂 Part 1: Sections API

Sections allow you to create curated collections of products (e.g., "Best Sellers", "New Arrivals").

**Base URL:** `/api/sections`

**Authorization:** `MANAGE_SECTIONS` permission required for create/update/delete

### 1. Create Section

**Endpoint:** `POST /api/sections`

**Authentication:** Required + `MANAGE_SECTIONS`

**Request Body:**

```json
{
  "title": "Best Sellers",
  "slug": "best-sellers",
  "products": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013"
  ],
  "isActive": true,
  "displayOrder": 1
}
```

**Success Response (201):**

```json
{
  "_id": "section123",
  "title": "Best Sellers",
  "slug": "best-sellers",
  "products": ["...", "...", "..."],
  "isActive": true,
  "displayOrder": 1,
  "createdAt": "2026-01-02T12:00:00.000Z",
  "updatedAt": "2026-01-02T12:00:00.000Z"
}
```

### 2. Get All Sections

**Endpoint:** `GET /api/sections`

**Authentication:** Not required

**Success Response (200):**

```json
[
  {
    "_id": "section123",
    "title": "Best Sellers",
    "slug": "best-sellers",
    "products": [
      {
        "_id": "prod123",
        "title": "Premium Wallet",
        "price": 4999,
        "images": [...]
      }
    ],
    "isActive": true,
    "displayOrder": 1
  }
]
```

**Notes:**

- Auto-sorted by `displayOrder` (ascending)
- Products are automatically populated

### 3. Get Section by ID

**Endpoint:** `GET /api/sections/id/:id`

### 4. Get Section by Slug

**Endpoint:** `GET /api/sections/:slug`

### 5. Update Section

**Endpoint:** `PUT /api/sections/:id`

**Authentication:** Required + `MANAGE_SECTIONS`

### 6. Delete Section

**Endpoint:** `DELETE /api/sections/:id`

**Authentication:** Required + `MANAGE_SECTIONS`

---

## 📤 Part 2: Upload API

Upload images to Cloudinary.

**Base URL:** `/api/upload`

**Authentication:** Required

### Upload Image

**Endpoint:** `POST /api/upload`

**Authentication:** Required (Bearer Token)

**Content-Type:** `multipart/form-data`

**Form Data:**

```
image: [File]  (required)
public_id: "product-123"  (optional)
folder: "products"  (optional)
convertToWebp: "true"  (optional)
```

**Example using FormData:**

```javascript
const formData = new FormData();
formData.append("image", fileInput.files[0]);
formData.append("folder", "products");
formData.append("convertToWebp", "true");

const response = await fetch("/api/upload", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "asset_id": "cloudinary_asset_id",
    "public_id": "products/product-123",
    "version": 1704201955,
    "format": "webp",
    "width": 1200,
    "height": 800,
    "url": "http://res.cloudinary.com/demo/image/upload/v1704201955/products/product-123.webp",
    "secure_url": "https://res.cloudinary.com/demo/image/upload/v1704201955/products/product-123.webp",
    "bytes": 125000,
    "created_at": "2026-01-02T12:00:00Z"
  }
}
```

**Error Responses:**

_No File (400):_

```json
{
  "error": "No file uploaded"
}
```

_Upload Failed (500):_

```json
{
  "error": "Upload failed"
}
```

**Notes:**

- Image is stored in MongoDB media collection
- Returns Cloudinary response with URLs
- WebP conversion optional
- Folder organization supported

**Media Model (Stored in DB):**

```typescript
{
  _id: ObjectId,
  url: string,           // Cloudinary secure_url
  filename: string,      // Original filename
  size: number,          // File size in bytes
  mimeType: string,      // File MIME type
  uploadedAt: Date
}
```

---

## 🌐 Part 3: Public API

Public-facing endpoints for products and categories (no auth required).

**Base URL:** `/api/public`

### Product Endpoints

#### 1. Get Public Products

**Endpoint:** `GET /api/public/products`

**Query Parameters:**

- `search` - Search query
- `category` - Category filter
- `brand` - Brand filter
- `minPrice` - Min price
- `maxPrice` - Max price
- `page` - Page number
- `limit` - Items per page
- `sort` - Sort field
- `order` - Sort order

#### 2. Get Product by ID

**Endpoint:** `GET /api/public/products/:id`

#### 3. Get Product by Slug

**Endpoint:** `GET /api/public/products/slug/:slug`

**Example:**

```
GET /api/public/products/slug/premium-leather-wallet
```

#### 4. Get Product Variants

**Endpoint:** `GET /api/public/products/:productId/variants`

#### 5. Get Variant by ID

**Endpoint:** `GET /api/public/variants/:variantId`

### Category Endpoints

#### 6. Get Public Categories

**Endpoint:** `GET /api/public/categories`

#### 7. Get Category by ID

**Endpoint:** `GET /api/public/categories/:id`

#### 8. Get Category by Slug

**Endpoint:** `GET /api/public/categories/slug/:slug`

**Example:**

```
GET /api/public/categories/slug/electronics
```

**Response Format:**
Same as regular product/category endpoints but optimized for public consumption.

---

## 💡 Usage Examples

### Upload Image and Create Product

```javascript
const uploadAndCreateProduct = async (token, imageFile, productData) => {
  // 1. Upload image
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("folder", "products");
  formData.append("convertToWebp", "true");

  const uploadRes = await fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const { data } = await uploadRes.json();

  // 2. Create product with uploaded image
  const productRes = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...productData,
      images: [
        {
          url: data.secure_url,
          isPrimary: true,
        },
      ],
    }),
  });

  return await productRes.json();
};
```

### Display Product Sections on Homepage

```javascript
const displayHomepage = async () => {
  // Get all sections
  const sectionsRes = await fetch("/api/sections");
  const sections = await sectionsRes.json();

  // Render each section
  sections.forEach((section) => {
    if (!section.isActive) return;

    console.log(`Section: ${section.title}`);
    section.products.forEach((product) => {
      console.log(`  - ${product.title}: ₹${product.price}`);
    });
  });
};
```

### Browse Public Products

```javascript
const browseProducts = async (categorySlug, page = 1) => {
  // Get category by slug
  const categoryRes = await fetch(
    `/api/public/categories/slug/${categorySlug}`
  );
  const category = await categoryRes.json();

  // Get products in category
  const productsRes = await fetch(
    `/api/public/products?category=${category._id}&page=${page}&limit=20`
  );
  const { products, total, totalPages } = await productsRes.json();

  return { products, total, totalPages };
};

// Usage
const { products } = await browseProducts("electronics", 1);
```

---

## ⚠️ Important Notes

### Sections

- Slugs must be lowercase, no spaces
- Products are references (ObjectIds)
- Sorted by `displayOrder` automatically
- Use for homepage, landing pages, featured collections

### Upload

- Requires authentication
- Stores metadata in MongoDB
- Returns Cloudinary URLs
- Supports WebP conversion
- Folder organization

### Public API

- No authentication required
- Read-only access
- Optimized for frontend consumption
- Supports slug-based access
- Same data as authenticated endpoints

---

## 🔒 Permission Summary

| Endpoint                 | Auth Required | Permission      |
| ------------------------ | ------------- | --------------- |
| POST /api/sections       | Yes           | MANAGE_SECTIONS |
| GET /api/sections        | No            | None            |
| PUT /api/sections/:id    | Yes           | MANAGE_SECTIONS |
| DELETE /api/sections/:id | Yes           | MANAGE_SECTIONS |
| POST /api/upload         | Yes           | None            |
| GET /api/public/\*       | No            | None            |
