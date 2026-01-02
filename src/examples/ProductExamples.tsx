// Example: Using Redux Products API in your components
// This file demonstrates how to integrate the Products API into your pages

import { useGetProductsQuery } from "@/store/slices/productsSlice";
import type { Product } from "@/types/product";

/**
 * Example 1: Simple Product Listing
 *
 * This example shows how to fetch and display products with loading states
 */
export function SimpleProductList() {
  const { data, isLoading, error } = useGetProductsQuery({ limit: 12 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          Failed to load products. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data?.products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

/**
 * Example 2: Shop Page with Filters and Pagination
 *
 * Complete example with search, category filter, price range, and pagination
 */
export function ShopPageExample() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: undefined,
    maxPrice: undefined,
  });

  const { data, isLoading } = useGetProductsQuery({
    ...filters,
    page,
    limit: 12,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="category_id_1">Jackets</option>
          <option value="category_id_2">Shoes</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice || ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              minPrice: Number(e.target.value) || undefined,
            })
          }
          className="px-4 py-2 border rounded-lg"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice || ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              maxPrice: Number(e.target.value) || undefined,
            })
          }
          className="px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <LoadingGrid />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {data?.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-black text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {data?.totalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === data?.totalPages}
          className="px-4 py-2 bg-black text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/**
 * Example 3: Product Details with Variants
 *
 * Shows how to fetch a product and its variants
 */
export function ProductDetailsExample({ productId }: { productId: string }) {
  const { data: productData, isLoading } = useGetProductByIdQuery(productId);
  const { data: variantsData } = useGetProductVariantsQuery(productId);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;

  const product = productData?.product;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <img
            src={
              product.images.find((img) => img.isPrimary)?.url ||
              product.images[0]?.url
            }
            alt={product.title}
            className="w-full rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.excerpt}</p>

          <div className="mb-6">
            <span className="text-2xl font-bold">
              ₹{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="ml-2 text-gray-500 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Variants */}
          {variantsData && variantsData.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select Variant:</h3>
              <div className="flex gap-2">
                {variantsData.variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => setSelectedVariant(variant._id)}
                    className={`px-4 py-2 border rounded ${
                      selectedVariant === variant._id
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {variant.attributes.map((attr) => attr.value).join(" / ")}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p className="text-gray-700">{product.description}</p>
      </div>
    </div>
  );
}

/**
 * Example 4: Admin - Create Product Form
 *
 * Protected endpoint example (requires authentication)
 */
export function CreateProductForm() {
  const [createProduct, { isLoading, error }] = useCreateProductMutation();
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    stock: 0,
    category: "",
    excerpt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createProduct({
        title: formData.title,
        price: formData.price,
        stock: formData.stock,
        category: formData.category,
        excerpt: formData.excerpt,
        images: [{ url: "https://example.com/image.jpg", isPrimary: true }],
      }).unwrap();

      alert("Product created successfully!");
      console.log("Created product:", result.product);
    } catch (err) {
      console.error("Failed to create product:", err);
      alert("Failed to create product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Product</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Product Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: Number(e.target.value) })
          }
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: Number(e.target.value) })
          }
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Category ID"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
          required
        />

        <textarea
          placeholder="Short Description"
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
          rows={3}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isLoading ? "Creating..." : "Create Product"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600">Error creating product</p>
        </div>
      )}
    </form>
  );
}

/**
 * Helper Components
 */
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
      <img
        src={
          product.images.find((img) => img.isPrimary)?.url ||
          product.images[0]?.url
        }
        alt={product.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">
            ₹{product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}
