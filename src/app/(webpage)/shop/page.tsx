"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Heart, ChevronRight, Plus } from "lucide-react";
import Filter from "./components/Filter";

const products = [
  {
    id: 1,
    name: "Classic Leather Oxford",
    price: "$189",
    rating: 4.8,
    reviews: 124,
    category: "Shoes",
    image:
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=80",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Minimalist Chelsea Boot",
    price: "$210",
    rating: 4.9,
    reviews: 98,
    category: "Shoes",
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Vintage Brown Derby",
    price: "$175",
    rating: 4.7,
    reviews: 156,
    category: "Shoes",
    image:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Heritage Leather Jacket",
    price: "$320",
    rating: 4.9,
    reviews: 203,
    category: "Jackets",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
    badge: "New Arrival",
  },
  {
    id: 5,
    name: "Rugged Moto Jacket",
    price: "$345",
    rating: 5.0,
    reviews: 87,
    category: "Jackets",
    image:
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Handstitched Loafers",
    price: "$199",
    rating: 4.6,
    reviews: 142,
    category: "Shoes",
    image:
      "https://images.unsplash.com/photo-1582897085656-c636d006a246?auto=format&fit=crop&w=900&q=80",
  },
];

export default function ShopPage() {
  const [favorites, setFavorites] = useState(new Set<number>());

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
      return newFavorites;
    });
  };

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
              Handpicked essentials for the discerning individual
            </p>
          </div>
          <Filter />
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group relative overflow-hidden border border-gray-100 hover:border-gray-300 bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-lg py-0!"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle overlay fade on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Product badge */}
                {product.badge && (
                  <Badge className="absolute top-4 left-4 bg-black text-white border-none shadow-md text-xs font-medium tracking-wide rounded-md px-2.5 py-1">
                    {product.badge}
                  </Badge>
                )}

                {/* Favorite button */}
                <Button
                  size="icon"
                  variant="secondary"
                  className={`absolute top-4 right-4 rounded-full shadow-md backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                    favorites.has(product.id)
                      ? "bg-black text-white hover:bg-gray-900"
                      : "bg-white/80 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      favorites.has(product.id) ? "fill-current" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1 font-medium">
                  {product.category}
                </p>
                <CardTitle className="text-[1.05rem] font-semibold leading-snug text-gray-900 group-hover:text-black transition-colors">
                  {product.name}
                </CardTitle>

                {/* Ratings */}
                <div className="flex items-center gap-1 mt-2 mb-3">
                  <Star className="w-4 h-4 fill-gray-300 text-gray-400" />
                  <span className="text-sm font-medium text-gray-800">
                    {product.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-semibold text-gray-900 tracking-tight">
                    {product.price}
                  </span>
                  <Button
                    size="sm"
                    className="bg-black text-white hover:bg-gray-900 transition-all rounded-sm px-4 font-medium cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" /><Plus />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

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
                className="bg-black text-white hover:bg-gray-800 transition-colors"
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
