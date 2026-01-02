"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Tag } from "lucide-react";
import { useState } from "react";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  onCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD = 50000; // ₹50,000

const CartSummary = ({
  subtotal,
  shipping,
  tax,
  onCheckout,
}: CartSummaryProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const total = subtotal + shipping + tax;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  const applyPromoCode = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      // In real implementation, validate promo code with backend
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 space-y-6 sticky top-24">
      <h2 className="text-2xl font-semibold text-gray-900 font-serif">
        Order Summary
      </h2>

      {/* Free Shipping Progress */}
      {!isFreeShipping && amountToFreeShipping > 0 && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800 font-medium">
            Add ₹{amountToFreeShipping.toLocaleString()} more for{" "}
            <span className="font-semibold">FREE SHIPPING</span>
          </p>
          <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-500 rounded-full"
              style={{
                width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {isFreeShipping && (
        <Badge className="w-full bg-green-600 text-white border-none py-2 text-sm justify-center">
          🎉 You qualify for FREE SHIPPING!
        </Badge>
      )}

      {/* Promo Code */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Promo Code</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="pl-10"
              disabled={promoApplied}
            />
          </div>
          <Button
            variant="outline"
            onClick={applyPromoCode}
            disabled={!promoCode.trim() || promoApplied}
            className="cursor-pointer"
          >
            {promoApplied ? "Applied" : "Apply"}
          </Button>
        </div>
        {promoApplied && (
          <p className="text-xs text-green-600 font-medium animate-in fade-in slide-in-from-top-2">
            ✓ Promo code applied successfully
          </p>
        )}
      </div>

      <div className="h-px bg-gray-200" />

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            ₹{subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">
            {isFreeShipping ? (
              <span className="text-green-600 font-semibold">FREE</span>
            ) : (
              `₹${shipping.toLocaleString()}`
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (GST)</span>
          <span className="font-medium text-gray-900">
            ₹{tax.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Total */}
      <div className="flex justify-between items-baseline">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-gray-900">
          ₹{total.toLocaleString()}
        </span>
      </div>

      {/* Checkout Button */}
      <Button
        size="lg"
        onClick={onCheckout}
        className="w-full bg-black text-white hover:bg-gray-900 transition-all duration-200 font-semibold cursor-pointer"
      >
        Proceed to Checkout
        <ChevronRight className="ml-2 w-5 h-5" />
      </Button>

      {/* Continue Shopping */}
      <a
        href="/shop"
        className="block text-center text-sm text-gray-600 hover:text-gray-900 transition-colors underline-offset-2 hover:underline"
      >
        Continue Shopping
      </a>

      {/* Trust Badges */}
      <div className="pt-4 space-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-green-500 rounded-full" />
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-green-500 rounded-full" />
          <span>Easy Returns within 30 days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-green-500 rounded-full" />
          <span>Premium Quality Guaranteed</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
