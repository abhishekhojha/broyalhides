"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetOrderByIdQuery } from "@/store/slices/checkoutSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Package,
  Calendar,
  CreditCard,
  Truck,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      } else {
        setIsLoggedIn(true);
      }
    }
  }, [router]);

  const { data, isLoading, error } = useGetOrderByIdQuery(orderId, {
    skip: !isLoggedIn || !orderId,
  });

  const order = data?.order;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      paid: "bg-green-100 text-green-800 border-green-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 pt-20">
        <Card className="w-full max-w-md p-8 bg-white shadow-xl text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Link href="/orders">
            <Button className="bg-black text-white hover:bg-gray-800 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-4 pt-24 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/orders">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order._id.slice(-8)}
              </h1>
              <Badge
                className={`${getStatusColor(order.status)} text-sm px-3 py-1`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <p className="text-gray-600 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="p-6 bg-white shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items ({order.items.length})
              </h2>
              <div className="divide-y divide-gray-100">
                {order.items.map((item, index) => (
                  <div key={index} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex gap-4">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/placeholder.png";
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.productTitle}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          SKU: {item.productSKU}
                        </p>
                        {item.variantAttributes &&
                          item.variantAttributes.length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {item.variantAttributes.map(
                                (attr: any, i: number) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                  >
                                    {attr.key}: {attr.value}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-600">
                            Qty: {item.quantity} × ₹
                            {item.price.toLocaleString()}
                          </span>
                          <span className="font-semibold text-gray-900">
                            ₹{(item.quantity * item.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Order Timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <Card className="p-6 bg-white shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Order Timeline
                </h2>
                <div className="space-y-4">
                  {order.statusHistory.map((history, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(
                            history.status
                          )}`}
                        >
                          {getStatusIcon(history.status)}
                        </div>
                        {index < order.statusHistory.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-gray-900 capitalize">
                          {history.status}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(history.date)}
                        </p>
                        {history.note && (
                          <p className="text-sm text-gray-600 mt-1">
                            {history.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tracking Info */}
            {order.trackingNumber && (
              <Card className="p-6 bg-blue-50 border-blue-200 shadow-lg">
                <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Tracking Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Carrier</p>
                    <p className="font-medium text-blue-900">
                      {order.carrier || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Tracking Number</p>
                    <p className="font-medium text-blue-900">
                      {order.trackingNumber}
                    </p>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="sm:col-span-2">
                      <p className="text-sm text-blue-700">
                        Estimated Delivery
                      </p>
                      <p className="font-medium text-blue-900">
                        {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="p-6 bg-white shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({order.taxRate}%)</span>
                  <span>₹{order.taxTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {order.shippingCost === 0
                      ? "Free"
                      : `₹${order.shippingCost.toLocaleString()}`}
                  </span>
                </div>
                {order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Discount {order.couponCode && `(${order.couponCode})`}
                    </span>
                    <span>-₹{order.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{order.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Payment Info */}
            <Card className="p-6 bg-white shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Method</p>
                  <p className="font-medium text-gray-900">
                    {order.payment.method}
                  </p>
                </div>
                {order.payment.transactionId && (
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-medium text-gray-900 text-sm break-all">
                      {order.payment.transactionId}
                    </p>
                  </div>
                )}
                {order.paymentStatus && (
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge
                      className={`mt-1 ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-6 bg-white shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              {order.shipping && (
                <div className="space-y-2 text-gray-700">
                  <p className="font-medium text-gray-900">
                    {order.shipping.name}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {order.shipping.phone}
                  </p>
                  {order.shipping.email && (
                    <p className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {order.shipping.email}
                    </p>
                  )}
                  <div className="pt-2 text-sm">
                    <p>{order.shipping.street}</p>
                    <p>
                      {order.shipping.city}, {order.shipping.state}{" "}
                      {order.shipping.zip}
                    </p>
                    <p>{order.shipping.country}</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Order Note */}
            {order.orderNote && (
              <Card className="p-6 bg-yellow-50 border-yellow-200 shadow-lg">
                <h2 className="text-lg font-semibold text-yellow-900 mb-2">
                  Order Note
                </h2>
                <p className="text-yellow-800 text-sm">{order.orderNote}</p>
              </Card>
            )}

            {/* Cancellation Reason */}
            {order.status === "cancelled" && (
              <Card className="p-6 bg-red-50 border-red-200 shadow-lg">
                <h2 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Cancellation
                </h2>
                <p className="text-red-800 text-sm">
                  This order has been cancelled.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
