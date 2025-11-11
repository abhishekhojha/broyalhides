"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"; // Adjust paths as needed
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FilterIcon, X } from "lucide-react";

// --- DATA (Expanded) ---
const categories = [
  { id: "shoes", label: "Shoes" },
  { id: "jackets", label: "Jackets" },
  { id: "bags", label: "Bags" },
  { id: "belts", label: "Belts" },
  { id: "hats", label: "Hats" },
];

const sizes = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
];

const colors = [
  { id: "black", name: "Black", hex: "#000000" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "brown", name: "Brown", hex: "#964B00" },
  { id: "blue", name: "Blue", hex: "#3b82f6" },
  { id: "red", name: "Red", hex: "#ef4444" },
];

const MIN_PRICE = 0;
const MAX_PRICE = 1000;
const DEFAULT_PRICE_RANGE = [MIN_PRICE, MAX_PRICE];

// --- COMPONENT ---
export default function Filter() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>(DEFAULT_PRICE_RANGE);

  // Handler for applying filters
  const applyFilters = () => {
    console.log("Applying filters:", {
      categories: selectedCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      price: priceRange,
    });
    // Here you would typically close the sheet and trigger a data refetch
  };

  // Handler to reset all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange(DEFAULT_PRICE_RANGE);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={"ghost"}
          size="sm"
          className="ml-2 flex items-center gap-1 text-gray-700 hover:bg-gray-100 rounded-lg font-mollie cursor-pointer"
        >
          <FilterIcon className="w-4 h-4" />
          Filter
        </Button>
      </SheetTrigger>
      
      <SheetContent
        side="right"
        className="w-[340px] sm:w-[400px] bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-l-2xl shadow-xl border border-gray-200 p-0 font-mollie flex flex-col"
      >
        <SheetHeader className="p-6 pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-2xl font-bold text-gray-900 tracking-tight">
              Filter Products
            </SheetTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm font-medium text-gray-600 hover:text-black">
              Clear All
            </Button>
          </div>
          <SheetDescription className="text-gray-500 pt-1">
            Refine your search with the options below.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-full flex-1 p-6">
          <div className="space-y-8">
            
            {/* Price Range Filter (Slider) */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-800 text-lg">
                Price Range
              </h4>
              <Slider
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-5"
              />
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            {/* Category Filter (Toggle Group) */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-800 text-lg">
                Category
              </h4>
              <ToggleGroup
                type="multiple"
                value={selectedCategories}
                onValueChange={setSelectedCategories}
                className="flex flex-wrap justify-start"
              >
                {categories.map((category) => (
                  <ToggleGroupItem
                    key={category.id}
                    value={category.id}
                    className="text-gray-700 bg-gray-50 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition border border-transparent data-[state=on]:bg-gray-900 data-[state=on]:text-white data-[state=on]:border-gray-900 font-medium text-sm"
                  >
                    {category.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="p-6 bg-white/50 backdrop-blur-sm border-t border-gray-200 rounded-b-2xl">
          <Button
            onClick={applyFilters}
            className="w-full bg-black text-white hover:bg-gray-900 rounded-lg shadow font-mollie text-base py-3"
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}