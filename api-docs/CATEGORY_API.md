# Category API Documentation

## Base URL

Category endpoints are prefixed with `/api/categories`

## Authentication & Authorization

- **Public Routes**: `GET /api/categories`, `GET /api/categories/:id`, and `GET /api/categories/slug/:slug` are publicly accessible
- **Protected Routes**: All other routes require:
  - Authentication (`requireAuth` middleware)
  - `MANAGE_CATEGORIES` permission (`requirePermission` middleware)

---

## 📁 Category Endpoints

### 1. Create Category

Create a new category with optional parent category (for hierarchical structure).

**Endpoint:** `POST /api/categories`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_CATEGORIES`

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**

```json
{
  "name": "Electronics",
  "slug": "electronics",
  "parent": null,
  "description": "Electronic devices and accessories",
  "image": "https://example.com/images/electronics.jpg",
  "status": "active"
}
```

**Field Details:**

- `name` (string, required): Category name (trimmed)
- `slug` (string, required): URL-friendly identifier (lowercase, alphanumeric, hyphens only, must be unique)
- `parent` (ObjectId, optional): Parent category ID for nested categories (null for top-level)
- `description` (string, optional): Category description
- `image` (string, optional): Category image URL
- `status` (string, optional, default: "active"): Category status
  - Allowed values: `"active"`, `"inactive"`

**Example Requests:**

_Top-Level Category:_

```json
{
  "name": "Electronics",
  "slug": "electronics",
  "description": "All electronic devices and accessories",
  "image": "https://example.com/images/electronics.jpg",
  "status": "active"
}
```

_Subcategory:_

```json
{
  "name": "Smartphones",
  "slug": "smartphones",
  "parent": "507f1f77bcf86cd799439011",
  "description": "Mobile phones and accessories",
  "image": "https://example.com/images/smartphones.jpg",
  "status": "active"
}
```

**Success Response (201):**

```json
{
  "message": "Category created",
  "category": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Electronics",
    "slug": "electronics",
    "parent": null,
    "description": "Electronic devices and accessories",
    "image": "https://example.com/images/electronics.jpg",
    "status": "active",
    "createdAt": "2026-01-02T11:35:00.000Z",
    "updatedAt": "2026-01-02T11:35:00.000Z"
  }
}
```

**Example Response with Parent:**

```json
{
  "message": "Category created",
  "category": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Smartphones",
    "slug": "smartphones",
    "parent": "507f1f77bcf86cd799439012",
    "description": "Mobile phones and accessories",
    "image": "https://example.com/images/smartphones.jpg",
    "status": "active",
    "createdAt": "2026-01-02T11:40:00.000Z",
    "updatedAt": "2026-01-02T11:40:00.000Z"
  }
}
```

**Error Responses:**

_Missing Required Fields (400):_

```json
{
  "message": "Name and slug are required."
}
```

_Invalid Slug Format (400):_

```json
{
  "message": "Slug must be lowercase, alphanumeric, and may contain hyphens."
}
```

_Invalid Status (400):_

```json
{
  "message": "Invalid status value."
}
```

_Invalid Parent ID (400):_

```json
{
  "message": "Invalid parent category ID."
}
```

_Slug Already Exists (409):_

```json
{
  "message": "Category with this slug already exists."
}
```

_Unauthorized/No Permission (401/403):_

```json
{
  "message": "Unauthorized"
}
```

**Slug Validation Rules:**

- Must be lowercase
- Can contain letters (a-z), numbers (0-9), and hyphens (-)
- No spaces, underscores, or special characters
- Examples:
  - ✅ Valid: `electronics`, `smart-phones`, `usb-c-cables`, `4k-tvs`
  - ❌ Invalid: `Electronics`, `Smart Phones`, `USB_C`, `special@chars`

---

### 2. Get All Categories

Retrieve a list of all categories with populated parent information.

**Endpoint:** `GET /api/categories`

**Authentication:** Not required

**Success Response (200):**

```json
{
  "categories": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Electronics",
      "slug": "electronics",
      "parent": null,
      "description": "Electronic devices and accessories",
      "image": "https://example.com/images/electronics.jpg",
      "status": "active",
      "createdAt": "2026-01-01T10:00:00.000Z",
      "updatedAt": "2026-01-01T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Smartphones",
      "slug": "smartphones",
      "parent": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Electronics",
        "slug": "electronics"
      },
      "description": "Mobile phones and accessories",
      "image": "https://example.com/images/smartphones.jpg",
      "status": "active",
      "createdAt": "2026-01-02T11:40:00.000Z",
      "updatedAt": "2026-01-02T11:40:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Laptops",
      "slug": "laptops",
      "parent": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Electronics",
        "slug": "electronics"
      },
      "description": "Portable computers and accessories",
      "image": "https://example.com/images/laptops.jpg",
      "status": "active",
      "createdAt": "2026-01-02T11:45:00.000Z",
      "updatedAt": "2026-01-02T11:45:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Fashion",
      "slug": "fashion",
      "parent": null,
      "description": "Clothing and accessories",
      "image": "https://example.com/images/fashion.jpg",
      "status": "active",
      "createdAt": "2026-01-02T12:00:00.000Z",
      "updatedAt": "2026-01-02T12:00:00.000Z"
    }
  ]
}
```

**Response Structure:**

- `categories` (array): Array of all category objects
  - Top-level categories have `parent: null`
  - Subcategories have `parent` populated with limited parent info (name and slug only)

**Notes:**

- Returns all categories regardless of status (both active and inactive)
- Parent field is populated automatically
- Categories are not sorted or filtered by default

---

### 3. Get Category by ID

Retrieve a single category by its ID with populated parent information.

**Endpoint:** `GET /api/categories/:id`

**Authentication:** Not required

**URL Parameters:**

- `id` (ObjectId, required): Category ID

**Example Request:**

```
GET /api/categories/507f1f77bcf86cd799439012
```

**Success Response (200):**

```json
{
  "category": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Smartphones",
    "slug": "smartphones",
    "parent": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Electronics",
      "slug": "electronics"
    },
    "description": "Mobile phones and accessories",
    "image": "https://example.com/images/smartphones.jpg",
    "status": "active",
    "createdAt": "2026-01-02T11:40:00.000Z",
    "updatedAt": "2026-01-02T11:40:00.000Z"
  }
}
```

**Example Response (Top-Level Category):**

```json
{
  "category": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Electronics",
    "slug": "electronics",
    "parent": null,
    "description": "Electronic devices and accessories",
    "image": "https://example.com/images/electronics.jpg",
    "status": "active",
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z"
  }
}
```

**Error Responses:**

_Invalid Category ID (400):_

```json
{
  "message": "Invalid category ID."
}
```

_Category Not Found (404):_

```json
{
  "message": "Category not found"
}
```

---

### 4. Get Category by Slug

Retrieve a single category by its URL-friendly slug with populated parent information.

**Endpoint:** `GET /api/categories/slug/:slug`

**Authentication:** Not required

**URL Parameters:**

- `slug` (string, required): URL-friendly category identifier (lowercase, alphanumeric, hyphens)

**Example Request:**

```
GET /api/categories/slug/smartphones
```

**Success Response (200):**

```json
{
  "category": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Smartphones",
    "slug": "smartphones",
    "parent": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Electronics",
      "slug": "electronics"
    },
    "description": "Mobile phones and accessories",
    "image": "https://example.com/images/smartphones.jpg",
    "status": "active",
    "createdAt": "2026-01-02T11:40:00.000Z",
    "updatedAt": "2026-01-02T11:40:00.000Z"
  }
}
```

**Example Response (Top-Level Category):**

```json
{
  "category": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Electronics",
    "slug": "electronics",
    "parent": null,
    "description": "Electronic devices and accessories",
    "image": "https://example.com/images/electronics.jpg",
    "status": "active",
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z"
  }
}
```

**Error Responses:**

_Category Not Found (404):_

```json
{
  "message": "Category not found"
}
```

**Notes:**

- Use this endpoint for SEO-friendly URLs (e.g., `/shop/electronics` instead of `/shop/507f1f77bcf86cd799439011`)
- Slug must match exactly (case-sensitive, lowercase)

---

### 5. Update Category

Update an existing category's details.

**Endpoint:** `PUT /api/categories/:id`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_CATEGORIES`

**URL Parameters:**

- `id` (ObjectId, required): Category ID

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Request Body:** (All fields are optional)

```json
{
  "name": "Consumer Electronics",
  "slug": "consumer-electronics",
  "parent": null,
  "description": "Updated description for electronics category",
  "image": "https://example.com/images/new-electronics.jpg",
  "status": "inactive"
}
```

**Example Requests:**

_Update Only Name and Description:_

```json
{
  "name": "Smartphones & Tablets",
  "description": "Mobile devices including phones and tablets"
}
```

_Change Parent Category:_

```json
{
  "parent": "507f1f77bcf86cd799439015"
}
```

_Remove Parent (Make Top-Level):_

```json
{
  "parent": null
}
```

_Update Status Only:_

```json
{
  "status": "inactive"
}
```

**Success Response (200):**

```json
{
  "message": "Category updated",
  "category": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Consumer Electronics",
    "slug": "consumer-electronics",
    "parent": null,
    "description": "Updated description for electronics category",
    "image": "https://example.com/images/new-electronics.jpg",
    "status": "inactive",
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-02T13:15:00.000Z"
  }
}
```

**Error Responses:**

_Invalid Category ID (400):_

```json
{
  "message": "Invalid category ID."
}
```

_Invalid Slug Format (400):_

```json
{
  "message": "Slug must be lowercase, alphanumeric, and may contain hyphens."
}
```

_Invalid Status (400):_

```json
{
  "message": "Invalid status value."
}
```

_Invalid Parent ID (400):_

```json
{
  "message": "Invalid parent category ID."
}
```

_Category Not Found (404):_

```json
{
  "message": "Category not found"
}
```

_Slug Already Exists (409):_

```json
{
  "message": "Category with this slug already exists."
}
```

**Notes:**

- Only fields provided in the request body will be updated
- Setting `parent` to `null` makes the category top-level
- Slug uniqueness is validated only if slug is changed
- Changing a category's parent doesn't affect its children

---

### 6. Delete Category

Delete a category from the system.

**Endpoint:** `DELETE /api/categories/:id`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_CATEGORIES`

**URL Parameters:**

- `id` (ObjectId, required): Category ID

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Example Request:**

```
DELETE /api/categories/507f1f77bcf86cd799439012
```

**Success Response (200):**

```json
{
  "message": "Category deleted"
}
```

**Error Responses:**

_Invalid Category ID (400):_

```json
{
  "message": "Invalid category ID."
}
```

_Category Not Found (404):_

```json
{
  "message": "Category not found"
}
```

_Unauthorized/No Permission (401/403):_

```json
{
  "message": "Unauthorized"
}
```

> [!WARNING] > **Cascade Considerations:**
>
> - Deleting a category does NOT automatically delete its subcategories
> - Subcategories will become orphaned (parent field references deleted category)
> - Products in the deleted category may also be affected
> - Consider implementing cascade delete or soft delete for better data management

---

## 📝 Data Models

### Category Model

```typescript
{
  _id: ObjectId,
  name: string,                    // Category name (required, trimmed)
  slug: string,                    // URL-friendly identifier (required, unique, lowercase)
  parent?: ObjectId | null,        // Parent category reference (null for top-level)
  description?: string,            // Optional category description
  image?: string,                  // Optional category image URL
  status: "active" | "inactive",   // Category status (default: "active")
  createdAt: Date,
  updatedAt: Date
}
```

### Populated Category (with Parent)

```typescript
{
  _id: ObjectId,
  name: string,
  slug: string,
  parent?: {
    _id: ObjectId,
    name: string,
    slug: string
  } | null,
  description?: string,
  image?: string,
  status: "active" | "inactive",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌳 Category Hierarchy

### Hierarchical Structure

Categories support unlimited nesting through the `parent` field:

```
Electronics (parent: null)
├── Smartphones (parent: Electronics)
│   ├── Android Phones (parent: Smartphones)
│   └── iPhones (parent: Smartphones)
├── Laptops (parent: Electronics)
│   ├── Gaming Laptops (parent: Laptops)
│   └── Business Laptops (parent: Laptops)
└── Audio (parent: Electronics)
    ├── Headphones (parent: Audio)
    └── Speakers (parent: Audio)

Fashion (parent: null)
├── Men's Clothing (parent: Fashion)
└── Women's Clothing (parent: Fashion)
```

### Example Data Structure

```json
[
  {
    "_id": "cat001",
    "name": "Electronics",
    "parent": null,
    "level": 0
  },
  {
    "_id": "cat002",
    "name": "Smartphones",
    "parent": "cat001",
    "level": 1
  },
  {
    "_id": "cat003",
    "name": "Android Phones",
    "parent": "cat002",
    "level": 2
  }
]
```

---

## ⚠️ Error Codes

| Status Code | Description                                 |
| ----------- | ------------------------------------------- |
| 200         | Success                                     |
| 201         | Created                                     |
| 400         | Bad Request (validation errors, invalid ID) |
| 401         | Unauthorized (missing/invalid token)        |
| 403         | Forbidden (insufficient permissions)        |
| 404         | Not Found (category not found)              |
| 409         | Conflict (slug already exists)              |
| 500         | Internal Server Error                       |

---

## 💡 Usage Examples

### Example 1: Create Category Hierarchy

```javascript
// Step 1: Create top-level category
const createTopLevel = async (token) => {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: "Electronics",
      slug: "electronics",
      description: "All electronic devices and accessories",
      status: "active",
    }),
  });

  const { category: electronics } = await response.json();
  console.log("Created:", electronics.name);
  return electronics;
};

// Step 2: Create subcategories
const createSubcategories = async (token, parentId) => {
  const subcategories = [
    { name: "Smartphones", slug: "smartphones" },
    { name: "Laptops", slug: "laptops" },
    { name: "Audio", slug: "audio" },
  ];

  for (const sub of subcategories) {
    await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...sub,
        parent: parentId,
        status: "active",
      }),
    });
  }
};

// Usage
const electronics = await createTopLevel(token);
await createSubcategories(token, electronics._id);
```

### Example 2: Build Category Tree for Navigation

```javascript
const buildCategoryTree = async () => {
  const response = await fetch("/api/categories");
  const { categories } = await response.json();

  // Separate top-level and subcategories
  const topLevel = categories.filter((cat) => cat.parent === null);
  const subCategories = categories.filter((cat) => cat.parent !== null);

  // Build tree structure
  const tree = topLevel.map((parent) => ({
    ...parent,
    children: subCategories.filter((sub) => sub.parent?._id === parent._id),
  }));

  return tree;
};

// Result:
// [
//   {
//     name: "Electronics",
//     slug: "electronics",
//     children: [
//       { name: "Smartphones", slug: "smartphones", ... },
//       { name: "Laptops", slug: "laptops", ... }
//     ]
//   },
//   {
//     name: "Fashion",
//     slug: "fashion",
//     children: [...]
//   }
// ]
```

### Example 3: Get Category with Breadcrumb

```javascript
const getCategoryBreadcrumb = async (categoryId) => {
  const breadcrumb = [];
  let currentId = categoryId;

  while (currentId) {
    const response = await fetch(`/api/categories/${currentId}`);
    const { category } = await response.json();

    breadcrumb.unshift({
      id: category._id,
      name: category.name,
      slug: category.slug,
    });

    currentId = category.parent?._id;
  }

  return breadcrumb;
};

// For "Android Phones" category:
// Result: [
//   { name: "Electronics", slug: "electronics" },
//   { name: "Smartphones", slug: "smartphones" },
//   { name: "Android Phones", slug: "android-phones" }
// ]
```

### Example 4: Update Category Status (Toggle Active/Inactive)

```javascript
const toggleCategoryStatus = async (token, categoryId, currentStatus) => {
  const newStatus = currentStatus === "active" ? "inactive" : "active";

  const response = await fetch(`/api/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });

  const { category } = await response.json();
  return category;
};
```

### Example 5: Search Categories by Name

```javascript
const searchCategories = async (searchTerm) => {
  const response = await fetch("/api/categories");
  const { categories } = await response.json();

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return filtered;
};

// Usage
const results = await searchCategories("phone");
// Returns categories with "phone" in the name
```

### Example 6: Get All Subcategories of a Category

```javascript
const getSubcategories = async (parentId) => {
  const response = await fetch("/api/categories");
  const { categories } = await response.json();

  return categories.filter((cat) => cat.parent?._id === parentId);
};

// Usage
const electronicsSubcategories = await getSubcategories(
  "507f1f77bcf86cd799439011"
);
```

### Example 7: Validate Slug Before Creation

```javascript
const isSlugAvailable = async (slug) => {
  const response = await fetch("/api/categories");
  const { categories } = await response.json();

  return !categories.some((cat) => cat.slug === slug);
};

// Usage
const available = await isSlugAvailable("new-category-slug");
if (available) {
  // Proceed with creation
} else {
  console.log("Slug already exists");
}
```

---

## 🎯 Best Practices

### 1. Slug Generation

Create URL-friendly slugs from category names:

```javascript
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

// Examples:
generateSlug("Men's Clothing"); // "mens-clothing"
generateSlug("Audio & Video"); // "audio-video"
generateSlug("  Smart  Phones  "); // "smart-phones"
```

### 2. Category Display Order

Since the API doesn't provide sorting, implement client-side ordering:

```javascript
const sortCategories = (categories, sortBy = "name") => {
  return categories.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });
};
```

### 3. Active Categories Only

Filter active categories for public display:

```javascript
const getActiveCategories = async () => {
  const response = await fetch("/api/categories");
  const { categories } = await response.json();

  return categories.filter((cat) => cat.status === "active");
};
```

### 4. Prevent Circular References

Before updating a category's parent, ensure it's not creating a circular reference:

```javascript
const isCircularReference = async (categoryId, newParentId) => {
  let currentId = newParentId;

  while (currentId) {
    if (currentId === categoryId) {
      return true; // Circular reference detected
    }

    const response = await fetch(`/api/categories/${currentId}`);
    const { category } = await response.json();
    currentId = category.parent?._id;
  }

  return false;
};
```

### 5. Orphan Detection

Find categories with deleted parent references:

```javascript
const findOrphans = async () => {
  const response = await fetch("/api/categories");
  const { categories } = await response.json();

  const allIds = new Set(categories.map((cat) => cat._id));

  return categories.filter((cat) => cat.parent && !allIds.has(cat.parent._id));
};
```

---

## 🔄 Category Management Workflows

### Workflow 1: Complete Category Setup

```javascript
class CategoryManager {
  constructor(token) {
    this.token = token;
    this.baseUrl = "/api/categories";
  }

  async create(categoryData) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(categoryData),
    });
    return await response.json();
  }

  async getAll() {
    const response = await fetch(this.baseUrl);
    const { categories } = await response.json();
    return categories;
  }

  async getById(id) {
    const response = await fetch(`${this.baseUrl}/${id}`);
    const { category } = await response.json();
    return category;
  }

  async update(id, updates) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(updates),
    });
    return await response.json();
  }

  async delete(id) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return await response.json();
  }

  async buildTree() {
    const categories = await this.getAll();
    const topLevel = categories.filter((cat) => cat.parent === null);

    const buildChildren = (parentId) => {
      return categories
        .filter((cat) => cat.parent?._id === parentId)
        .map((cat) => ({
          ...cat,
          children: buildChildren(cat._id),
        }));
    };

    return topLevel.map((cat) => ({
      ...cat,
      children: buildChildren(cat._id),
    }));
  }
}
```

---

## 📌 Important Notes

1. **Parent Population**: GET endpoints automatically populate parent with `name` and `slug` only

2. **Slug Uniqueness**: Slugs must be unique across all categories

3. **Slug Format**: Must be lowercase, alphanumeric, and may contain hyphens only

4. **No Cascade Delete**: Deleting a category doesn't delete subcategories or products

5. **No Circular Reference Check**: The API doesn't prevent setting circular parent references

6. **No Depth Limit**: Categories can be nested to unlimited depth

7. **Status Field**: Both active and inactive categories are returned in GET requests

8. **No Sorting**: Categories are returned in database order (consider client-side sorting)

9. **No Pagination**: All categories are returned in a single request

10. **Image Validation**: Image URLs are not validated by the API

---

## 🚀 Enhancement Suggestions

Consider implementing these features for production:

1. **Cascade Operations**: Soft delete or cascade when deleting parent categories
2. **Circular Reference Prevention**: Validate parent updates
3. **Slug Auto-generation**: Generate slug from name if not provided
4. **Category Ordering**: Add `order` field for custom sorting
5. **Active Filter**: Query parameter to filter by status
6. **Depth Limit**: Prevent excessive category nesting
7. **Product Count**: Include count of products in each category
8. **Image Validation**: Validate image URLs or integrate with upload service
9. **Pagination**: Add pagination for large category lists
10. **Search**: Server-side category name search
