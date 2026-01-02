"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  ShoppingBag,
  CreditCard,
  Wallet,
  MapPin,
  User,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useGetCartQuery } from "@/store/slices/cartSlice";
import {
  useCheckoutMutation,
  useVerifyPaymentMutation,
} from "@/store/slices/checkoutSlice";
import { toast } from "sonner";
import type { Product } from "@/types/product";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const { data: cartData, isLoading: isLoadingCart } = useGetCartQuery();
  const [checkout] = useCheckoutMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Check authentication
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  const getProductDetails = (item: any) => {
    const product =
      typeof item.product === "string" ? null : (item.product as Product);
    return {
      id: typeof item.product === "string" ? item.product : product?._id || "",
      name: product?.title || "Product",
      image: product?.images?.[0]?.url || "/images/placeholder.png",
      price: product?.discountPrice || product?.price || 0,
    };
  };

  const cartItems = cartData?.items || [];
  const subtotal = cartItems.reduce((sum: number, item: any) => {
    const details = getProductDetails(item);
    return sum + details.price * item.quantity;
  }, 0);

  const validateForm = () => {
    const { fullName, email, phone, address, city, state, pincode } =
      shippingInfo;

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      toast.error("Please fill all shipping details");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleRazorpayPayment = (
    orderId: string,
    razorpayOrderId: string,
    amount: number
  ) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "BroyalHides",
      description: "Premium Leather Products",
      order_id: razorpayOrderId,
      handler: async function (response: any) {
        try {
          // Verify payment with backend
          await verifyPayment({
            orderId: orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }).unwrap();

          toast.success("Payment successful! Your order has been placed.");
          router.push("/orders");
        } catch (error: any) {
          console.error("Payment verification failed:", error);
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: shippingInfo.fullName,
        email: shippingInfo.email,
        contact: shippingInfo.phone,
      },
      theme: {
        color: "#000000",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          toast.error("Payment cancelled");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const checkoutData = {
        products: cartItems.map((item: any) => ({
          product:
            typeof item.product === "string" ? item.product : item.product._id,
          variant: item.variant
            ? typeof item.variant === "string"
              ? item.variant
              : item.variant._id
            : null,
          quantity: item.quantity,
        })),
        shipping: {
          name: shippingInfo.fullName,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.pincode,
          country: "India",
          method: "standard",
        },
        paymentMethod: "ONLINE" as "COD" | "ONLINE",
      };

      const response = await checkout(checkoutData).unwrap();

      // Razorpay payment
      handleRazorpayPayment(
        response.order._id,
        response.razorpayOrderId!,
        response.order.totalAmount
      );
    } catch (error: any) {
      console.error("Checkout failed:", error);
      toast.error(
        error?.data?.message || "Failed to place order. Please try again."
      );
      setIsProcessing(false);
    }
  };

  if (isLoadingCart) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">Add some items to checkout</p>
          <Link href="/shop">
            <Button className="bg-black text-white hover:bg-gray-900 cursor-pointer">
              Start Shopping
            </Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 mt-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/cart"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Checkout
            </h1>
          </div>
          <p className="text-gray-600 ml-9">Complete your purchase</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Shipping Information
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={shippingInfo.fullName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="John Doe"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        email: e.target.value,
                      })
                    }
                    placeholder="john@example.com"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        phone: e.target.value,
                      })
                    }
                    placeholder="9876543210"
                    maxLength={10}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={shippingInfo.pincode}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        pincode: e.target.value,
                      })
                    }
                    placeholder="110001"
                    maxLength={6}
                    className="border-gray-300"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                    placeholder="123 Main Street, Apartment 4B"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={shippingInfo.city}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, city: e.target.value })
                    }
                    placeholder="New Delhi"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={shippingInfo.state}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        state: e.target.value,
                      })
                    }
                    placeholder="Delhi"
                    className="border-gray-300"
                  />
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="flex items-center gap-3 border border-black rounded-lg p-4 bg-gray-50">
                <Wallet className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold">Pay Online (Razorpay)</p>
                  <p className="text-sm text-gray-500">
                    Credit/Debit Card, UPI, Net Banking, Wallets
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item: any, index: number) => {
                  const details = getProductDetails(item);
                  return (
                    <div key={index} className="flex gap-3">
                      <img
                        src={details.image}
                        alt={details.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/placeholder.png";
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900 line-clamp-1">
                          {details.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{(details.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pt-4 border-t">
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-black text-white hover:bg-gray-900 cursor-pointer py-6 text-lg font-semibold"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  `Place Order - ₹${subtotal.toLocaleString()}`
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
