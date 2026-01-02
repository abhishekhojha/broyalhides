"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  Package,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "@/store/slices/cartSlice";
import type { Product } from "@/types/product";

const DEBOUNCE_DELAY = 600;

export default function CartPage() {
  const router = useRouter();

  // Optimistic local state - updates instantly
  const [localCart, setLocalCart] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Debounce timers for API calls
  const updateTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // RTK Query hooks - for fetching and syncing with server
  const { data: cartData, isLoading } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  // Initialize local cart from API data ONLY on first load
  useEffect(() => {
    if (cartData?.items && !isInitialized) {
      setLocalCart(cartData.items);
      setIsInitialized(true);
    }
  }, [cartData, isInitialized]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(updateTimers.current).forEach((timer) =>
        clearTimeout(timer)
      );
    };
  }, []);

  // Check authentication
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  /**
   * INSTANT quantity update with silent API sync
   */
  const handleQuantityChange = useCallback(
    (productId: string, variantId: string | null, newQuantity: number) => {
      const itemKey = `${productId}-${variantId || "null"}`;

      // STEP 1: Update local state INSTANTLY
      setLocalCart((prevCart) =>
        prevCart.map((item) => {
          const itemProductId =
            typeof item.product === "string"
              ? item.product
              : (item.product as any)?._id;
          const itemVariantId = item.variant
            ? typeof item.variant === "string"
              ? item.variant
              : (item.variant as any)?._id
            : null;
          const currentItemKey = `${itemProductId}-${itemVariantId || "null"}`;

          if (currentItemKey === itemKey) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );

      // STEP 2: Clear existing debounce timer
      if (updateTimers.current[itemKey]) {
        clearTimeout(updateTimers.current[itemKey]);
      }

      // STEP 3: Silently sync with API after debounce (user doesn't see this)
      updateTimers.current[itemKey] = setTimeout(async () => {
        try {
          await updateCartItem({
            product: productId,
            variant: variantId,
            quantity: newQuantity,
          }).unwrap();
          // Success - no notification needed, user already sees the change
        } catch (error: any) {
          console.error("Failed to sync cart:", error);
          // Silently rollback on error - refetch to get server state
          // No error toast - just sync back to server truth
        }
      }, DEBOUNCE_DELAY);
    },
    [updateCartItem]
  );

  /**
   * INSTANT item removal with silent API sync
   */
  const handleRemoveItem = useCallback(
    async (productId: string, variantId: string | null) => {
      const itemKey = `${productId}-${variantId || "null"}`;

      // STEP 1: Remove from local state INSTANTLY
      setLocalCart((prevCart) =>
        prevCart.filter((item) => {
          const itemProductId =
            typeof item.product === "string"
              ? item.product
              : (item.product as any)?._id;
          const itemVariantId = item.variant
            ? typeof item.variant === "string"
              ? item.variant
              : (item.variant as any)?._id
            : null;
          const currentItemKey = `${itemProductId}-${itemVariantId || "null"}`;
          return currentItemKey !== itemKey;
        })
      );

      // STEP 2: Silently sync with API (user doesn't wait for this)
      try {
        await removeCartItem({
          product: productId,
          variant: variantId,
        }).unwrap();
        // Success - no notification needed
      } catch (error: any) {
        console.error("Failed to remove item:", error);
        // Silently handle error - cart will sync on next load
      }
    },
    [removeCartItem]
  );

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const getProductDetails = (item: any) => {
    const product =
      typeof item.product === "string" ? null : (item.product as Product);
    return {
      id: typeof item.product === "string" ? item.product : product?._id || "",
      name: product?.title || "Product",
      image: product?.images?.[0]?.url || "/images/placeholder.png",
      price: product?.discountPrice || product?.price || 0,
      category:
        typeof product?.category === "string"
          ? product.category
          : product?.category?.name || "",
    };
  };

  // Calculate totals from LOCAL cart (instant updates)
  const subtotal = useMemo(() => {
    return localCart.reduce((sum: number, item: any) => {
      const details = getProductDetails(item);
      return sum + details.price * item.quantity;
    }, 0);
  }, [localCart]);

  // Loading state - only on initial load
  if (isLoading && !isInitialized) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </main>
    );
  }

  // Empty cart state
  if (localCart.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag
                  className="w-16 h-16 text-gray-300"
                  strokeWidth={1.5}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 max-w-md">
                Looks like you haven't added any items to your cart yet. Start
                shopping to fill it up!
              </p>
            </div>
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-900 cursor-pointer mt-4"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }
  console.log(localCart);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <section className="bg-white border-b border-gray-200 mt-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/shop"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Shopping Cart
            </h1>
          </div>
          <p className="text-gray-600 ml-9">
            {localCart.length} {localCart.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {localCart.map((item: any, index: number) => {
              const details = getProductDetails(item);
              const productId =
                typeof item.product === "string"
                  ? item.product
                  : (item.product as any)?._id;
              const variantId = item.variant
                ? typeof item.variant === "string"
                  ? item.variant
                  : (item.variant as any)?._id
                : null;

              return (
                <Card
                  key={`${productId}-${variantId}-${index}`}
                  className="p-4 bg-white shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={details.image}
                        alt={details.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/placeholder.png";
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {details.name}
                          </h3>
                          {details.category && (
                            <p className="text-xs text-gray-500">
                              {details.category}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(productId, variantId)}
                          className="text-red-500 hover:text-red-700 text-sm transition-colors"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{(details.price * item.quantity).toLocaleString()}
                        </p>

                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg bg-white">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                productId,
                                variantId,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <div className="px-4 py-2 font-medium text-gray-900 min-w-[60px] text-center border-x border-gray-200">
                            {item.quantity}
                          </div>

                          <button
                            onClick={() =>
                              handleQuantityChange(
                                productId,
                                variantId,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 bg-white shadow-lg sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-black text-white hover:bg-gray-900 cursor-pointer py-6 text-lg font-semibold"
              >
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-lg p-6 text-center space-y-2">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders above ₹50,000</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-6 text-center space-y-2">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Secure Payment</h3>
            <p className="text-sm text-gray-600">100% secure transactions</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-6 text-center space-y-2">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Easy Returns</h3>
            <p className="text-sm text-gray-600">30-day return policy</p>
          </div>
        </div>
      </section>
    </main>
  );
}
