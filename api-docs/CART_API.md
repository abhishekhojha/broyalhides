# Cart API Documentation

## Base URL

Cart endpoints are prefixed with `/api/cart`

## Authentication

**All cart endpoints require authentication** (`requireAuth` middleware).

---

## 🛒 Cart Endpoints

### 1. Get User Cart

Retrieve the authenticated user's shopping cart.

**Endpoint:** `GET /api/cart`

**Authentication:** Required (Bearer Token)

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
{
  "items": [
    {
      "product": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Premium Leather Wallet",
        "slug": "premium-leather-wallet",
        "price": 4999,
        "discountPrice": 3999,
        "stock": 50,
        "images": [
          {
            "url": "https://example.com/wallet.jpg",
            "isPrimary": true
          }
        ],
        "SKU": "WALLET-001"
      },
      "variant": null,
      "quantity": 2
    },
    {
      "product": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Smartphone",
        "price": 29999,
        "stock": 25
      },
      "variant": {
        "_id": "507f1f77bcf86cd799439013",
        "attributes": [
          { "key": "Color", "value": "Black" },
          { "key": "Storage", "value": "128GB" }
        ],
        "price": 29999,
        "stock": 15,
        "SKU": "PHONE-001-BLK-128"
      },
      "quantity": 1
    }
  ]
}
```

**Empty Cart Response (200):**

```json
{
  "items": []
}
```

**Notes:**

- Cart items are automatically cleaned (invalid products removed)
- Products/variants are populated automatically
- Cart expires after 7 days of inactivity

---

### 2. Add Item to Cart

Add a product or variant to the cart.

**Endpoint:** `POST /api/cart/add`

**Authentication:** Required (Bearer Token)

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**

```json
{
  "product": "507f1f77bcf86cd799439011",
  "variant": null,
  "quantity": 2
}
```

**Field Details:**

- `product` (ObjectId, required): Product ID
- `variant` (ObjectId, optional): Variant ID (if selecting a variant)
- `quantity` (number, required): Quantity (min: 1)

**Example Requests:**

_Add Product Without Variant:_

```json
{
  "product": "507f1f77bcf86cd799439011",
  "quantity": 1
}
```

_Add Product With Variant:_

```json
{
  "product": "507f1f77bcf86cd799439012",
  "variant": "507f1f77bcf86cd799439013",
  "quantity": 2
}
```

**Success Response (200):**

```json
{
  "success": true,
  "items": [
    {
      "product": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Premium Leather Wallet",
        "price": 4999,
        "stock": 50
      },
      "variant": null,
      "quantity": 2
    }
  ]
}
```

**Error Responses:**

_Invalid Product or Quantity (400):_

```json
{
  "error": "Invalid product or quantity"
}
```

_Product Not Found (400):_

```json
{
  "error": "Product not found"
}
```

_Variant Not Available (400):_

```json
{
  "error": "Variant not available"
}
```

_Product Out of Stock (400):_

```json
{
  "error": "Product out of stock"
}
```

**Behavior:**

- If item already exists in cart, quantity is updated (not added)
- Cart is created automatically if it doesn't exist
- Stock availability is validated before adding
- Products are populated in the response

---

### 3. Update Cart Item Quantity

Update the quantity of an existing cart item.

**Endpoint:** `PUT /api/cart/update`

**Authentication:** Required (Bearer Token)

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**

```json
{
  "product": "507f1f77bcf86cd799439011",
  "variant": null,
  "quantity": 3
}
```

**Field Details:**

- `product` (ObjectId, required): Product ID
- `variant` (ObjectId, optional): Variant ID (must match existing cart item)
- `quantity` (number, required): New quantity (min: 1)

**Success Response (200):**

```json
{
  "success": true,
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "variant": null,
      "quantity": 3
    }
  ]
}
```

**Error Responses:**

_Invalid Quantity (400):_

```json
{
  "error": "Invalid quantity"
}
```

_Cart Not Found (404):_

```json
{
  "error": "Cart not found"
}
```

_Cart Item Not Found (404):_

```json
{
  "error": "Cart item not found"
}
```

**Notes:**

- Quantity must be at least 1
- Both product and variant must match exactly
- Stock validation is not performed during update

---

### 4. Remove Item from Cart

Remove a specific product/variant from the cart.

**Endpoint:** `DELETE /api/cart/remove`

**Authentication:** Required (Bearer Token)

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**

```json
{
  "product": "507f1f77bcf86cd799439011",
  "variant": null
}
```

**Field Details:**

- `product` (ObjectId, required): Product ID
- `variant` (ObjectId, optional): Variant ID (if the item has a variant)

**Success Response (200):**

```json
{
  "success": true,
  "items": []
}
```

**Error Response:**

_Cart Not Found (404):_

```json
{
  "error": "Cart not found"
}
```

**Notes:**

- Both product and variant must match to remove the item
- If cart becomes empty, it remains but with empty items array

---

### 5. Sync Cart

Merge guest cart (from localStorage) with backend cart after login.

**Endpoint:** `POST /api/cart/sync`

**Authentication:** Required (Bearer Token)

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**

```json
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "variant": null,
      "quantity": 2
    },
    {
      "product": "507f1f77bcf86cd799439012",
      "variant": "507f1f77bcf86cd799439013",
      "quantity": 1
    }
  ]
}
```

**Field Details:**

- `items` (array, required): Array of cart items from guest session

**Success Response (200):**

```json
{
  "success": true,
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "variant": null,
      "quantity": 2
    },
    {
      "product": "507f1f77bcf86cd799439012",
      "variant": "507f1f77bcf86cd799439013",
      "quantity": 1
    }
  ]
}
```

**Merge Strategy:**

- If item exists in both carts, keeps the maximum quantity
- Invalid items (deleted products, out of stock) are automatically removed
- Cart is created if it doesn't exist

---

## 📝 Data Models

### Cart Model

```typescript
{
  _id: ObjectId,
  user: ObjectId,               // Reference to User
  items: [
    {
      product: ObjectId,         // Reference to Product
      variant?: ObjectId,        // Optional reference to Variant
      quantity: number           // Min: 1
    }
  ],
  updatedAt: Date,               // Auto-expires after 7 days
  createdAt: Date
}
```

### Cart Item (Populated Response)

```typescript
{
  product: {
    _id: ObjectId,
    title: string,
    price: number,
    discountPrice?: number,
    stock: number,
    images: [...],
    SKU: string,
    ...otherProductFields
  },
  variant?: {
    _id: ObjectId,
    attributes: [{ key: string, value: string }],
    price: number,
    stock: number,
    SKU: string,
    image: string
  } | null,
  quantity: number
}
```

---

## 💡 Usage Examples

### Example 1: Complete Cart Flow

```javascript
// Add product to cart
const addToCart = async (token, productId, quantity) => {
  const response = await fetch("/api/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product: productId,
      quantity,
    }),
  });

  return await response.json();
};

// Get cart
const getCart = async (token) => {
  const response = await fetch("/api/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { items } = await response.json();
  return items;
};

// Update quantity
const updateQuantity = async (token, productId, newQuantity) => {
  const response = await fetch("/api/cart/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product: productId,
      quantity: newQuantity,
    }),
  });

  return await response.json();
};

// Remove item
const removeItem = async (token, productId, variantId = null) => {
  const response = await fetch("/api/cart/remove", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product: productId,
      variant: variantId,
    }),
  });

  return await response.json();
};
```

### Example 2: Sync Guest Cart on Login

```javascript
// Save guest cart to localStorage
const saveGuestCart = (items) => {
  localStorage.setItem("guestCart", JSON.stringify(items));
};

// Sync guest cart with backend after login
const syncCartOnLogin = async (token) => {
  const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

  if (guestCart.length === 0) return;

  const response = await fetch("/api/cart/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: guestCart,
    }),
  });

  const { items } = await response.json();

  // Clear guest cart
  localStorage.removeItem("guestCart");

  return items;
};
```

### Example 3: Calculate Cart Total

```javascript
const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    const price = item.variant
      ? item.variant.price
      : item.product.discountPrice || item.product.price;

    return total + price * item.quantity;
  }, 0);
};

// Usage
const cart = await getCart(token);
const subtotal = calculateCartTotal(cart);
console.log(`Cart Subtotal: ₹${subtotal}`);
```

### Example 4: Cart Management Component

```javascript
class CartManager {
  constructor(token) {
    this.token = token;
    this.baseUrl = "/api/cart";
  }

  async get() {
    const response = await fetch(this.baseUrl, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    const { items } = await response.json();
    return items;
  }

  async add(productId, variantId = null, quantity = 1) {
    const response = await fetch(`${this.baseUrl}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        product: productId,
        variant: variantId,
        quantity,
      }),
    });
    return await response.json();
  }

  async updateQuantity(productId, variantId, quantity) {
    const response = await fetch(`${this.baseUrl}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        product: productId,
        variant: variantId,
        quantity,
      }),
    });
    return await response.json();
  }

  async remove(productId, variantId = null) {
    const response = await fetch(`${this.baseUrl}/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        product: productId,
        variant: variantId,
      }),
    });
    return await response.json();
  }

  async sync(guestItems) {
    const response = await fetch(`${this.baseUrl}/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ items: guestItems }),
    });
    return await response.json();
  }

  async getTotal() {
    const items = await this.get();
    return items.reduce((total, item) => {
      const price = item.variant
        ? item.variant.price
        : item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  }

  async getItemCount() {
    const items = await this.get();
    return items.reduce((count, item) => count + item.quantity, 0);
  }
}

// Usage
const cartManager = new CartManager(token);
const items = await cartManager.get();
const total = await cartManager.getTotal();
const count = await cartManager.getItemCount();
```

---

## ⚠️ Important Notes

1. **Auto-Cleanup**: Invalid items are automatically removed when fetching cart
2. **TTL**: Cart expires after 7 days of inactivity
3. **Stock Validation**: Only performed during add operation
4. **Update Behavior**: Adding existing items updates quantity (doesn't increment)
5. **Variant Matching**: Both product and variant must match for updates/removals
6. **One Cart Per User**: Each user can have only one cart
7. **Population**: Products and variants are automatically populated
8. **Empty Response**: Returns `{ items: [] }` for empty/non-existent carts

---

## 🔒 Security Notes

- All endpoints require authentication
- Users can only access their own cart
- Stock validation prevents over-ordering
- Deleted products are filtered out automatically
- No permission checks (all authenticated users can manage their cart)
