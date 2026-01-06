"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Star,
  Heart,
  ChevronRight,
  Plus,
  Loader2,
  LogIn,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Filter, { FilterState } from "./components/Filter";
import { useGetProductsQuery } from "@/store/slices/productsSlice";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "@/store/slices/cartSlice";
import type { Product } from "@/types/product";
import { toast } from "sonner";

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState(new Set<string>());
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Initialize filters from URL params (for mega menu category links)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: searchParams.get("category") || "",
    brand: "",
    minPrice: undefined,
    maxPrice: undefined,
  });

  // Update filters when URL params change (mega menu navigation)
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && categoryFromUrl !== filters.category) {
      setFilters((prev) => ({ ...prev, category: categoryFromUrl }));
      setPage(1);
    }
  }, [searchParams]);

  // Check if user is logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  // Build query params for API
  const queryParams = {
    ...(filters.search && { search: filters.search }),
    ...(filters.category && { category: filters.category }),
    ...(filters.brand && { brand: filters.brand }),
    ...(filters.minPrice !== undefined && { minPrice: filters.minPrice }),
    ...(filters.maxPrice !== undefined && { maxPrice: filters.maxPrice }),
    page,
    limit: 12,
  };

  // Fetch products from backend using Redux
  const { data, isLoading, error } = useGetProductsQuery(queryParams);

  // Fetch cart data to check if items are already in cart
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isLoggedIn,
  });

  // Add to cart mutation
  const [addToCart] = useAddToCartMutation();

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  // Handle filter apply (close sheet callback)
  const handleFilterApply = useCallback(() => {
    // Filters already applied via handleFiltersChange
  }, []);

  // Check if product is already in cart
  const isProductInCart = (productId: string) => {
    if (!cartData?.items) return false;
    return cartData.items.some((item: any) => {
      const itemProductId =
        typeof item.product === "string" ? item.product : item.product?._id;
      return itemProductId === productId;
    });
  };

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      await addToCart({
        product: productId,
        variant: null,
        quantity: 1,
      }).unwrap();

      toast.success("Added to cart successfully!");
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      toast.error(
        error?.data?.message || "Failed to add to cart. Please try again."
      );
    } finally {
      setAddingToCart(null);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
      return newFavorites;
    });
  };

  // Helper function to get primary image or first image
  const getProductImage = (product: Product) => {
    const primaryImage = product.images?.find((img) => img.isPrimary);
    return (
      primaryImage?.url || product.images?.[0]?.url || "/images/placeholder.png"
    );
  };

  // Helper function to format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  // Helper function to get category name
  const getCategoryName = (category: any) => {
    if (typeof category === "string") return category;
    return category?.name || "Product";
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.brand ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900 border-b border-gray-200">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-16">
          <Badge className="mb-6 bg-gray-900 text-white border-none">
            Limited Collection
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Timeless Leather. <br />
            <span className="text-gray-500">Modern Craft.</span>
          </h1>
        </div>
      </section>

      {/* Shop Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold">Featured Collection</h2>
            <p className="text-gray-500 mt-1">
              {data ? `${data.total} products found` : "Loading products..."}
              {hasActiveFilters && " (filtered)"}
            </p>
          </div>
          <Filter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onApply={handleFilterApply}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-2">
              Failed to load products
            </p>
            <p className="text-red-500 text-sm">
              {typeof error === "object" && "data" in error
                ? JSON.stringify(error.data)
                : "Please check your connection and try again"}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white hover:bg-red-700"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && data?.products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No products found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !error && data && data.products.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.products.map((product) => (
                <Link key={product._id} href={`/shop/${product._id}`}>
                  <Card className="group relative overflow-hidden border border-gray-100 hover:border-gray-300 bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-lg py-0! cursor-pointer">
                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={getProductImage(product)}
                        alt={product.title}
                        className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/placeholder.png";
                        }}
                      />

                      {/* Subtle overlay fade on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Product badge for discounted items */}
                      {product.discountPrice && (
                        <Badge className="absolute top-4 left-4 bg-black text-white border-none shadow-md text-xs font-medium tracking-wide rounded-md px-2.5 py-1">
                          Sale
                        </Badge>
                      )}

                      {/* Low stock badge */}
                      {product.stock < 10 && product.stock > 0 && (
                        <Badge className="absolute top-4 left-4 bg-orange-600 text-white border-none shadow-md text-xs font-medium tracking-wide rounded-md px-2.5 py-1">
                          Only {product.stock} left
                        </Badge>
                      )}

                      {/* Out of stock badge */}
                      {product.stock === 0 && (
                        <Badge className="absolute top-4 left-4 bg-red-600 text-white border-none shadow-md text-xs font-medium tracking-wide rounded-md px-2.5 py-1">
                          Out of Stock
                        </Badge>
                      )}

                      {/* Favorite button - Only show when logged in */}
                      {isLoggedIn && (
                        <Button
                          size="icon"
                          variant="secondary"
                          className={`absolute top-4 right-4 rounded-full shadow-md backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                            favorites.has(product._id)
                              ? "bg-black text-white hover:bg-gray-900"
                              : "bg-white/80 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(product._id);
                          }}
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              favorites.has(product._id) ? "fill-current" : ""
                            }`}
                          />
                        </Button>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1 font-medium">
                        {getCategoryName(product.category)}
                      </p>
                      <h3 className="text-[1.05rem] font-semibold leading-snug text-gray-900 group-hover:text-black transition-colors mb-2">
                        {product.title}
                      </h3>

                      {/* Excerpt */}
                      {product.excerpt && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                          {product.excerpt}
                        </p>
                      )}

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-col">
                          {product.discountPrice ? (
                            <>
                              <span className="text-lg font-semibold text-gray-900 tracking-tight">
                                {formatPrice(product.discountPrice)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-semibold text-gray-900 tracking-tight">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>

                        {/* Show Add to Cart if logged in, Login button if not */}
                        {isLoggedIn ? (
                          isProductInCart(product._id) ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-600 text-green-600 hover:bg-green-50 transition-all rounded-sm px-4 font-medium cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push("/cart");
                              }}
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              View Cart
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product._id);
                              }}
                              disabled={
                                product.stock === 0 ||
                                addingToCart === product._id
                              }
                              className="bg-black text-white hover:bg-gray-900 transition-all rounded-sm px-4 font-medium cursor-pointer disabled:opacity-50"
                            >
                              {addingToCart === product._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4" />
                                  <Plus />
                                </>
                              )}
                            </Button>
                          )
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-black text-black hover:bg-black hover:text-white transition-all rounded-sm px-3 font-medium cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              router.push("/login");
                            }}
                          >
                            <LogIn className="w-4 h-4 mr-1" />
                            Login to Buy
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="cursor-pointer"
                >
                  Previous
                </Button>
                <div className="flex gap-2">
                  {[...Array(data.totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      variant={page === i + 1 ? "default" : "outline"}
                      className={`cursor-pointer ${
                        page === i + 1 ? "bg-black text-white" : ""
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() =>
                    setPage((p) => Math.min(data.totalPages, p + 1))
                  }
                  disabled={page === data.totalPages}
                  variant="outline"
                  className="cursor-pointer"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <div className="mt-20 relative overflow-hidden bg-gradient-to-r from-gray-50 via-white to-gray-200 rounded-3xl p-12 shadow-md border border-gray-200">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center"></div>
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-black text-white border-none">
                Craftsmanship Promise
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Quality that lasts a lifetime
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Every piece is handcrafted using ethically sourced, full-grain
                leather and built to age beautifully. Combining timeless
                tradition with modern innovation.
              </p>
              <ul className="space-y-2 mb-8 text-gray-700">
                <li>• Full-Grain Leather</li>
                <li>• Hand-Stitched Precision</li>
                <li>• Lifetime Repair Service</li>
              </ul>
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Explore Collection <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="hidden md:block relative">
              <img
                src="/images/about/about5.jpeg"
                alt="Leather craftsmanship"
                className="rounded-2xl shadow-xl aspect-[16/9] object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
