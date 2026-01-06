"use client";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { FilterIcon, Search, X } from "lucide-react";
import { useGetCategoriesQuery } from "@/store/slices/categoriesSlice";

// Filter state interface
export interface FilterState {
  search: string;
  category: string;
  brand: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
}

interface FilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
}

const MIN_PRICE = 0;
const MAX_PRICE = 50000; // 50,000 INR max

export default function Filter({
  filters,
  onFiltersChange,
  onApply,
}: FilterProps) {
  // Local state for draft filters (before applying)
  const [draftFilters, setDraftFilters] = useState<FilterState>(filters);
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice || MIN_PRICE,
    filters.maxPrice || MAX_PRICE,
  ]);

  // Fetch categories from API
  const { data: categoriesData } = useGetCategoriesQuery();

  // Get only active parent categories for filter
  const categories =
    categoriesData?.categories?.filter(
      (cat) => cat.status === "active" && !cat.parent
    ) || [];

  // Sync draft filters when parent filters change
  useEffect(() => {
    setDraftFilters(filters);
    setPriceRange([
      filters.minPrice || MIN_PRICE,
      filters.maxPrice || MAX_PRICE,
    ]);
  }, [filters]);

  // Update draft search
  const handleSearchChange = (value: string) => {
    setDraftFilters((prev) => ({ ...prev, search: value }));
  };

  // Update draft category
  const handleCategoryChange = (categoryId: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      category: prev.category === categoryId ? "" : categoryId,
    }));
  };

  // Update draft brand
  const handleBrandChange = (value: string) => {
    setDraftFilters((prev) => ({ ...prev, brand: value }));
  };

  // Update draft price range
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    setDraftFilters((prev) => ({
      ...prev,
      minPrice: values[0] === MIN_PRICE ? undefined : values[0],
      maxPrice: values[1] === MAX_PRICE ? undefined : values[1],
    }));
  };

  // Apply filters and notify parent
  const applyFilters = () => {
    onFiltersChange(draftFilters);
    onApply();
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      category: "",
      brand: "",
      minPrice: undefined,
      maxPrice: undefined,
    };
    setDraftFilters(clearedFilters);
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    onFiltersChange(clearedFilters);
  };

  // Format price for display
  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.brand ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 flex items-center gap-1 text-gray-700 hover:bg-gray-100 rounded-lg font-mollie cursor-pointer relative"
        >
          <FilterIcon className="w-4 h-4" />
          Filter
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full" />
          )}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              Clear All
            </Button>
          </div>
          <SheetDescription className="text-gray-500 pt-1">
            Refine your search with the options below.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-full flex-1 p-6">
          <div className="space-y-8">
            {/* Search Input */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-800 text-lg">
                Search
              </h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={draftFilters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-black focus:ring-black"
                />
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-800 text-lg">
                Price Range
              </h4>
              <Slider
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={500}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="my-5"
              />
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-800 text-lg">
                Category
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category._id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      draftFilters.category === category._id
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
                {categories.length === 0 && (
                  <p className="text-gray-500 text-sm">Loading categories...</p>
                )}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-800 text-lg">
                Brand
              </h4>
              <Input
                type="text"
                placeholder="Filter by brand..."
                value={draftFilters.brand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="bg-white border-gray-200 focus:border-black focus:ring-black"
              />
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="p-6 bg-white/50 backdrop-blur-sm border-t border-gray-200 rounded-b-2xl">
          <SheetClose asChild>
            <Button
              onClick={applyFilters}
              className="w-full bg-black text-white hover:bg-gray-900 rounded-lg shadow font-mollie text-base py-3"
            >
              Apply Filters
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
