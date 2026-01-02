"use client";

import { useGetOrdersQuery } from "@/store/slices/checkoutSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Calendar, CreditCard, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrdersPage() {
  const router = useRouter();
  const { data, isLoading, error } = useGetOrdersQuery();

  // Redirect if not logged in
  if (typeof window !== "undefined" && !localStorage.getItem("token")) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 pt-20">
        <Card className="w-full max-w-md p-8 bg-white shadow-xl">
          <p className="text-red-600 text-center">Failed to load orders</p>
          <Button
            onClick={() => router.push("/")}
            className="w-full mt-4 bg-black text-white hover:bg-gray-800 cursor-pointer"
          >
            Go Home
          </Button>
        </Card>
      </main>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-4 pt-24 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">
            {data?.pagination?.total || 0}{" "}
            {data?.pagination?.total === 1 ? "order" : "orders"}
          </p>
        </div>

        {/* Empty State */}
        {!data?.orders || data.orders.length === 0 ? (
          <Card className="p-12 bg-white shadow-xl text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here
            </p>
            <Link href="/shop">
              <Button className="bg-black text-white hover:bg-gray-800 cursor-pointer">
                Start Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {data.orders.map((order) => (
              <Card
                key={order._id}
                className="p-6 bg-white shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        {order.payment.method}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{order.grandTotal.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} items
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productTitle}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {item.productTitle}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × ₹
                            {item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-600 mb-4">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Shipping Info */}
                <div className="border-t border-gray-200 pt-4 mt-4 flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">
                      Shipping Address
                    </p>
                    {order.shipping ? (
                      <p className="text-sm text-gray-600">
                        {order.shipping.name}
                        <br />
                        {order.shipping.street}, {order.shipping.city}
                        <br />
                        {order.shipping.state} {order.shipping.zip},{" "}
                        {order.shipping.country}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Shipping address not available
                      </p>
                    )}
                  </div>
                  <Link href={`/orders/${order._id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Tracking Information
                    </p>
                    <p className="text-sm text-blue-700">
                      {order.carrier}: {order.trackingNumber}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
