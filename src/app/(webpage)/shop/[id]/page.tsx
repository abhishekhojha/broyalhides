"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Heart,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  Loader2,
  LogIn,
  Package,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
  X,
  ZoomIn,
} from "lucide-react";
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "@/store/slices/productsSlice";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "@/store/slices/cartSlice";
import type { Product, Variant, ProductAttribute } from "@/types/product";
import { toast } from "sonner";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  // Fetch product data using product ID
  const { data: productData, isLoading, error } = useGetProductByIdQuery(id);

  // Fetch related products (same category)
  const { data: relatedData } = useGetProductsQuery(
    {
      category:
        typeof productData?.product?.category === "object"
          ? productData?.product?.category?._id
          : productData?.product?.category,
      limit: 4,
    },
    {
      skip: !productData?.product?.category,
    }
  );

  // Cart data
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isLoggedIn,
  });
  const [addToCart] = useAddToCartMutation();

  const product = productData?.product;

  // Filter related products to exclude current product
  const relatedProducts = useMemo(() => {
    if (!relatedData?.products || !product) return [];
    return relatedData.products
      .filter((p) => p._id !== product._id)
      .slice(0, 4);
  }, [relatedData, product]);

  // Get the active price based on selected variant or base product
  const activePrice = useMemo(() => {
    if (selectedVariant) {
      return {
        price: selectedVariant.price,
        discountPrice: selectedVariant.discountPrice,
        stock: selectedVariant.stock,
      };
    }
    return {
      price: product?.price || 0,
      discountPrice: product?.discountPrice,
      stock: product?.stock || 0,
    };
  }, [selectedVariant, product]);

  // Check if product is in cart
  const isProductInCart = useMemo(() => {
    if (!cartData?.items || !product) return false;
    return cartData.items.some((item: any) => {
      const itemProductId =
        typeof item.product === "string" ? item.product : item.product?._id;
      return itemProductId === product._id;
    });
  }, [cartData, product]);

  // Get primary image or first image
  const getProductImage = (prod: Product, index: number = 0) => {
    if (!prod.images || prod.images.length === 0)
      return "/images/placeholder.png";
    return prod.images[index]?.url || prod.images[0]?.url;
  };

  // Get all product images including variant image
  const allImages = useMemo(() => {
    const images = product?.images || [];
    if (selectedVariant?.image) {
      return [
        { url: selectedVariant.image, isPrimary: true },
        ...images.filter((img) => img.url !== selectedVariant.image),
      ];
    }
    return images;
  }, [product, selectedVariant]);

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  // Get category name
  const getCategoryName = (category: any) => {
    if (typeof category === "string") return category;
    return category?.name || "";
  };

  // Get available variants grouped by attribute key
  const variantGroups = useMemo(() => {
    const variants = product?.variants as Variant[] | undefined;
    if (!variants || variants.length === 0) return {};

    const groups: Record<string, { value: string; variant: Variant }[]> = {};

    variants.forEach((variant) => {
      variant.attributes?.forEach((attr) => {
        if (!groups[attr.key]) {
          groups[attr.key] = [];
        }
        // Avoid duplicates
        if (!groups[attr.key].some((item) => item.value === attr.value)) {
          groups[attr.key].push({ value: attr.value, variant });
        }
      });
    });

    return groups;
  }, [product]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      await addToCart({
        product: product._id,
        variant: selectedVariant?._id || null,
        quantity,
      }).unwrap();

      toast.success("Added to cart successfully!");
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      toast.error(
        error?.data?.message || "Failed to add to cart. Please try again."
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find the product you're looking for. It may have
            been removed or the link is incorrect.
          </p>
          <Link href="/shop">
            <Button className="bg-black text-white hover:bg-gray-900 cursor-pointer">
              Back to Shop
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 mt-14">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/shop"
              className="hover:text-gray-900 transition-colors"
            >
              Shop
            </Link>
            {getCategoryName(product.category) && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-500">
                  {getCategoryName(product.category)}
                </span>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
        </div>
      </nav>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in group"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={
                  allImages[selectedImageIndex]?.url || getProductImage(product)
                }
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder.png";
                }}
              />
              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {/* Sale badge */}
              {activePrice.discountPrice && (
                <Badge className="absolute top-4 left-4 bg-black text-white border-none">
                  Sale
                </Badge>
              )}
              {/* Favorite button */}
              {isLoggedIn && (
                <Button
                  size="icon"
                  variant="secondary"
                  className={`absolute top-4 right-4 rounded-full shadow-md backdrop-blur-sm border transition-all cursor-pointer ${
                    isFavorite
                      ? "bg-black text-white hover:bg-gray-900"
                      : "bg-white/80 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFavorite(!isFavorite);
                  }}
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                  />
                </Button>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === index
                        ? "border-black"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.title} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder.png";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Brand */}
            <div className="flex items-center gap-3">
              {getCategoryName(product.category) && (
                <Badge
                  variant="secondary"
                  className="text-xs uppercase tracking-wider"
                >
                  {getCategoryName(product.category)}
                </Badge>
              )}
              {product.brand && (
                <span className="text-sm text-gray-500">{product.brand}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {activePrice.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(activePrice.discountPrice)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(activePrice.price)}
                  </span>
                  <Badge className="bg-green-600 text-white border-none">
                    {Math.round(
                      ((activePrice.price - activePrice.discountPrice) /
                        activePrice.price) *
                        100
                    )}
                    % OFF
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(activePrice.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {activePrice.stock > 0 ? (
                activePrice.stock < 10 ? (
                  <>
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span className="text-orange-600 font-medium">
                      Only {activePrice.stock} left in stock
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-green-600 font-medium">In Stock</span>
                  </>
                )
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Excerpt */}
            {product.excerpt && (
              <p className="text-gray-600 leading-relaxed">{product.excerpt}</p>
            )}

            {/* Variant Selection */}
            {Object.keys(variantGroups).length > 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {Object.entries(variantGroups).map(([key, items]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {key}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedVariant(item.variant)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                            selectedVariant?._id === item.variant._id
                              ? "border-black bg-black text-white"
                              : "border-gray-300 hover:border-gray-500 text-gray-700"
                          }`}
                        >
                          {item.value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-medium text-gray-900 min-w-[60px] text-center border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(activePrice.stock, q + 1))
                    }
                    disabled={quantity >= activePrice.stock}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Total Price for Quantity */}
                <div className="text-lg font-semibold text-gray-900">
                  Total:{" "}
                  {formatPrice(
                    (activePrice.discountPrice || activePrice.price) * quantity
                  )}
                </div>
              </div>

              {/* Add to Cart / Login Button */}
              {isLoggedIn ? (
                isProductInCart ? (
                  <Link href="/cart" className="block">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50 py-6 text-lg font-semibold cursor-pointer"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      View Cart
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={activePrice.stock === 0 || isAddingToCart}
                    className="w-full bg-black text-white hover:bg-gray-900 py-6 text-lg font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {isAddingToCart ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 mr-2" />
                    )}
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </Button>
                )
              ) : (
                <Link href="/login" className="block">
                  <Button
                    size="lg"
                    className="w-full bg-black text-white hover:bg-gray-900 py-6 text-lg font-semibold cursor-pointer"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Login to Buy
                  </Button>
                </Link>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto text-gray-600 mb-1" />
                <p className="text-xs text-gray-500">Free Delivery</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto text-gray-600 mb-1" />
                <p className="text-xs text-gray-500">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto text-gray-600 mb-1" />
                <p className="text-xs text-gray-500">30-Day Returns</p>
              </div>
            </div>

            {/* SKU */}
            {product.SKU && (
              <p className="text-xs text-gray-500 pt-4">SKU: {product.SKU}</p>
            )}
          </div>
        </div>
      </section>

      {/* Product Description & Attributes */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Description
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p
                    className={`text-gray-600 leading-relaxed ${
                      !showFullDescription && product.description.length > 500
                        ? "line-clamp-6"
                        : ""
                    }`}
                  >
                    {product.description}
                  </p>
                  {product.description.length > 500 && (
                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="text-black font-medium mt-2 hover:underline cursor-pointer"
                    >
                      {showFullDescription ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Product Details
                </h2>
                <div className="space-y-3">
                  {product.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-3 border-b border-gray-100"
                    >
                      <span className="text-gray-600">{attr.key}</span>
                      <span className="text-gray-900 font-medium">
                        {attr.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              You May Also Like
            </h2>
            <Link
              href="/shop"
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct._id}
                href={`/shop/${relatedProduct._id}`}
              >
                <Card className="group overflow-hidden border border-gray-100 hover:border-gray-300 bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer py-0!">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={getProductImage(relatedProduct)}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder.png";
                      }}
                    />
                    {relatedProduct.discountPrice && (
                      <Badge className="absolute top-3 left-3 bg-black text-white border-none text-xs">
                        Sale
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      {getCategoryName(relatedProduct.category)}
                    </p>
                    <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors line-clamp-1">
                      {relatedProduct.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      {relatedProduct.discountPrice ? (
                        <>
                          <span className="font-bold text-gray-900">
                            {formatPrice(relatedProduct.discountPrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(relatedProduct.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-gray-900">
                          {formatPrice(relatedProduct.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((i) =>
                    i > 0 ? i - 1 : allImages.length - 1
                  );
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((i) =>
                    i < allImages.length - 1 ? i + 1 : 0
                  );
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          <img
            src={allImages[selectedImageIndex]?.url || getProductImage(product)}
            alt={product.title}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/placeholder.png";
            }}
          />

          {/* Image counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedImageIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
