# Redux Products API - Usage Guide

## Overview

The Redux Products API integration provides typed hooks for interacting with the backend Products API. All hooks are automatically generated from RTK Query and include built-in caching, loading states, and error handling.

---

## Available Hooks

### Query Hooks (GET requests)

#### 1. `useGetProductsQuery` - Get all products

```typescript
import { useGetProductsQuery } from "@/store/slices/productsSlice";

function ProductsList() {
  const { data, isLoading, error } = useGetProductsQuery({
    search: "leather",
    category: "507f1f77bcf86cd799439011",
    minPrice: 1000,
    maxPrice: 5000,
    page: 1,
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {data?.products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
      <Pagination total={data?.totalPages} current={data?.page} />
    </div>
  );
}
```

**Parameters** (all optional):

- `search` - Search in title, SKU, brand, excerpt
- `category` - Filter by category ID
- `brand` - Filter by brand name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `role` - Role-based filtering (e.g., 'customer' for in-stock only)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### 2. `useGetProductByIdQuery` - Get single product

```typescript
import { useGetProductByIdQuery } from "@/store/slices/productsSlice";

function ProductDetails({ productId }: { productId: string }) {
  const { data, isLoading, error } = useGetProductByIdQuery(productId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Product not found</div>;

  return <div>{data?.product.title}</div>;
}
```

#### 3. `useGetProductVariantsQuery` - Get all variants for a product

```typescript
import { useGetProductVariantsQuery } from "@/store/slices/productsSlice";

function ProductVariants({ productId }: { productId: string }) {
  const { data, isLoading } = useGetProductVariantsQuery(productId);

  return (
    <div>
      {data?.variants.map((variant) => (
        <VariantOption key={variant._id} variant={variant} />
      ))}
    </div>
  );
}
```

#### 4. `useGetVariantByIdQuery` - Get single variant

```typescript
import { useGetVariantByIdQuery } from "@/store/slices/productsSlice";

function VariantDetails({ variantId }: { variantId: string }) {
  const { data } = useGetVariantByIdQuery(variantId);
  return <div>{data?.variant.SKU}</div>;
}
```

---

### Mutation Hooks (POST/PUT/DELETE requests)

All mutations return a tuple `[mutationFn, { isLoading, error, data }]`

#### 5. `useCreateProductMutation` - Create new product (Protected)

```typescript
import { useCreateProductMutation } from "@/store/slices/productsSlice";

function CreateProductForm() {
  const [createProduct, { isLoading, error }] = useCreateProductMutation();

  const handleSubmit = async (formData) => {
    try {
      const result = await createProduct({
        title: formData.title,
        price: formData.price,
        stock: formData.stock,
        category: formData.categoryId,
        images: [{ url: formData.imageUrl, isPrimary: true }],
      }).unwrap();

      console.log("Product created:", result.product);
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### 6. `useUpdateProductMutation` - Update product (Protected)

```typescript
import { useUpdateProductMutation } from "@/store/slices/productsSlice";

function EditProduct({ productId }: { productId: string }) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const handleUpdate = async () => {
    await updateProduct({
      id: productId,
      updates: {
        price: 5999,
        stock: 45,
      },
    });
  };

  return <button onClick={handleUpdate}>Update Price</button>;
}
```

#### 7. `useDeleteProductMutation` - Delete product (Protected)

```typescript
import { useDeleteProductMutation } from "@/store/slices/productsSlice";

function DeleteProductButton({ productId }: { productId: string }) {
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    if (confirm("Are you sure?")) {
      await deleteProduct(productId);
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      {isLoading ? "Deleting..." : "Delete"}
    </button>
  );
}
```

#### 8. `useAddVariantMutation` - Add variant to product (Protected)

```typescript
import { useAddVariantMutation } from "@/store/slices/productsSlice";

function AddVariantForm({ productId }: { productId: string }) {
  const [addVariant] = useAddVariantMutation();

  const handleSubmit = async () => {
    await addVariant({
      productId,
      variant: {
        attributes: [
          { key: "Color", value: "Black" },
          { key: "Size", value: "Large" },
        ],
        price: 5499,
        stock: 30,
      },
    });
  };

  return <button onClick={handleSubmit}>Add Variant</button>;
}
```

#### 9. `useUpdateVariantMutation` - Update variant (Protected)

```typescript
import { useUpdateVariantMutation } from "@/store/slices/productsSlice";

function UpdateVariant({ variantId }: { variantId: string }) {
  const [updateVariant] = useUpdateVariantMutation();

  const handleUpdate = async () => {
    await updateVariant({
      variantId,
      updates: {
        price: 5999,
        stock: 35,
      },
    });
  };

  return <button onClick={handleUpdate}>Update Variant</button>;
}
```

#### 10. `useDeleteVariantMutation` - Delete variant (Protected)

```typescript
import { useDeleteVariantMutation } from "@/store/slices/productsSlice";

function DeleteVariant({
  variantId,
  productId,
}: {
  variantId: string;
  productId: string;
}) {
  const [deleteVariant] = useDeleteVariantMutation();

  const handleDelete = async () => {
    await deleteVariant({ variantId, productId });
  };

  return <button onClick={handleDelete}>Delete Variant</button>;
}
```

---

## Advanced Usage

### Pagination Example

```typescript
import { useState } from "react";
import { useGetProductsQuery } from "@/store/slices/productsSlice";

function ProductsWithPagination() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetProductsQuery({ page, limit: 12 });

  return (
    <>
      <ProductGrid products={data?.products} loading={isLoading} />
      <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>
        Page {page} of {data?.totalPages}
      </span>
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={page === data?.totalPages}
      >
        Next
      </button>
    </>
  );
}
```

### Filter Example

```typescript
import { useState } from "react";
import { useGetProductsQuery } from "@/store/slices/productsSlice";

function FilteredProducts() {
  const [filters, setFilters] = useState({
    search: "",
    minPrice: 0,
    maxPrice: 100000,
    category: "",
  });

  const { data, isLoading } = useGetProductsQuery(filters);

  return (
    <>
      <input
        placeholder="Search products..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />
      <PriceRangeSlider
        min={filters.minPrice}
        max={filters.maxPrice}
        onChange={(min, max) =>
          setFilters({ ...filters, minPrice: min, maxPrice: max })
        }
      />
      <ProductGrid products={data?.products} loading={isLoading} />
    </>
  );
}
```

### With Product Variants

```typescript
import {
  useGetProductByIdQuery,
  useGetProductVariantsQuery,
} from "@/store/slices/productsSlice";

function ProductWithVariants({ productId }: { productId: string }) {
  const { data: productData } = useGetProductByIdQuery(productId);
  const { data: variantsData } = useGetProductVariantsQuery(productId);

  return (
    <div>
      <h1>{productData?.product.title}</h1>
      <p>Base Price: ₹{productData?.product.price}</p>

      <h2>Available Variants:</h2>
      {variantsData?.variants.map((variant) => (
        <div key={variant._id}>
          {variant.attributes.map((attr) => (
            <span key={attr.key}>
              {attr.key}: {attr.value}
            </span>
          ))}
          <span>Price: ₹{variant.price}</span>
        </div>
      ))}
    </div>
  );
}
```

---

## Error Handling

```typescript
import { useGetProductsQuery } from "@/store/slices/productsSlice";

function ProductsWithErrorHandling() {
  const { data, isLoading, error } = useGetProductsQuery();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    if ("status" in error) {
      // FetchBaseQueryError
      const errMsg =
        "error" in error ? error.error : JSON.stringify(error.data);
      return <div>Error: {errMsg}</div>;
    } else {
      // SerializedError
      return <div>Error: {error.message}</div>;
    }
  }

  return <ProductGrid products={data?.products} />;
}
```

---

## Cache Invalidation

RTK Query automatically invalidates and refetches data when related mutations occur:

- Creating a product → Refetches product list
- Updating a product → Refetches that specific product
- Deleting a product → Refetches product list
- Adding/deleting variant → Refetches product and its variants

This happens automatically with no additional code needed!

---

## TypeScript Types

All hooks are fully typed. Import types as needed:

```typescript
import type { Product, Variant, ProductFilters } from "@/types/product";

const product: Product = {
  _id: "123",
  title: "Leather Wallet",
  price: 4999,
  // ... TypeScript will enforce all required fields
};
```

---

## Environment Variables

Make sure to set the API base URL in your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Or it will default to `http://localhost:5000`.

---

## Authentication

Protected endpoints (create, update, delete) automatically include the JWT token from `localStorage.getItem('token')` in the Authorization header.

Make sure to set the token after login:

```typescript
localStorage.setItem("token", "your-jwt-token");
```

---

## Notes

- All query hooks automatically cache results
- Refetching happens in the background when data becomes stale
- Mutations provide loading and error states
- Use `.unwrap()` on mutations to handle success/error with try/catch
- Skip queries conditionally with `skip` option: `useGetProductByIdQuery(id, { skip: !id })`
