"use client";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CartItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  category?: string;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({
  id,
  name,
  image,
  price,
  quantity,
  size,
  color,
  category,
  onQuantityChange,
  onRemove,
}: CartItemProps) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(id), 300);
  };

  const incrementQuantity = () => {
    onQuantityChange(id, quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  return (
    <div
      className={`group relative bg-white border border-gray-100 rounded-lg p-4 md:p-6 transition-all duration-300 ${
        isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"
      } hover:shadow-md`}
    >
      <div className="flex gap-4 md:gap-6">
        {/* Product Image */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-md overflow-hidden bg-gray-50">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {category && (
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-medium">
                {category}
              </p>
            )}
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 font-serif">
              {name}
            </h3>
            <div className="flex gap-4 text-sm text-gray-600 mb-3">
              {size && (
                <span>
                  Size:{" "}
                  <span className="font-medium text-gray-900">{size}</span>
                </span>
              )}
              {color && (
                <span>
                  Color:{" "}
                  <span className="font-medium text-gray-900">{color}</span>
                </span>
              )}
            </div>
          </div>

          {/* Price and Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-md">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="h-8 w-8 rounded-l-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="min-w-[2rem] text-center font-medium text-gray-900 transition-all duration-200">
                {quantity}
              </span>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={incrementQuantity}
                className="h-8 w-8 rounded-r-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <p className="text-lg md:text-xl font-semibold text-gray-900">
                ₹{(price * quantity).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={handleRemove}
          className="absolute top-4 right-4 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
