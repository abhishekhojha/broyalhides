"use client";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useGetProfileQuery } from "@/store/slices/authSlice";
import { useGetCartQuery } from "@/store/slices/cartSlice";
import { useGetCategoriesQuery } from "@/store/slices/categoriesSlice";
import type { Category } from "@/types/category";

// Category node with children for hierarchy
interface CategoryNode {
  _id: string;
  name: string;
  slug: string;
  children: CategoryNode[];
}

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mega menu state
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeParent, setActiveParent] = useState<string | null>(null);
  const [activeChild, setActiveChild] = useState<string | null>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems = ["Shop",  "About", "Contact"];

  // Check if user is logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  // Get user profile (skip if not logged in)
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !isLoggedIn,
  });

  // Get cart (skip if not logged in)
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isLoggedIn,
  });

  // Fetch categories for mega menu
  const { data: categoriesData } = useGetCategoriesQuery();

  // Build category hierarchy from flat array
  const categoryHierarchy = useMemo(() => {
    if (!categoriesData?.categories) return [];

    const activeCategories = categoriesData.categories.filter(
      (cat) => cat.status === "active"
    );

    // Create a map for quick lookup
    const categoryMap = new Map<string, CategoryNode>();
    activeCategories.forEach((cat) => {
      categoryMap.set(cat._id, {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        children: [],
      });
    });

    // Build hierarchy
    const rootCategories: CategoryNode[] = [];
    activeCategories.forEach((cat) => {
      const node = categoryMap.get(cat._id)!;
      const parentId =
        typeof cat.parent === "object" && cat.parent !== null
          ? cat.parent._id
          : cat.parent;

      if (parentId && categoryMap.has(parentId)) {
        categoryMap.get(parentId)!.children.push(node);
      } else if (!parentId) {
        rootCategories.push(node);
      }
    });

    return rootCategories;
  }, [categoriesData]);

  // Get children of active parent
  const activeParentChildren = useMemo(() => {
    if (!activeParent) return [];
    const parent = categoryHierarchy.find((cat) => cat._id === activeParent);
    return parent?.children || [];
  }, [categoryHierarchy, activeParent]);

  // Get children of active child (sub-children)
  const activeChildChildren = useMemo(() => {
    if (!activeChild) return [];
    const child = activeParentChildren.find((cat) => cat._id === activeChild);
    return child?.children || [];
  }, [activeParentChildren, activeChild]);

  const cartItemCount =
    cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setProfileDropdownOpen(false);
      router.push("/");
      router.refresh();
    }
  };

  // Mega menu hover handlers with debounce to prevent flicker
  const handleMegaMenuEnter = useCallback(() => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setIsMegaMenuOpen(true);
    // Set first parent as active by default
    if (categoryHierarchy.length > 0 && !activeParent) {
      setActiveParent(categoryHierarchy[0]._id);
    }
  }, [categoryHierarchy, activeParent]);

  const handleMegaMenuLeave = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
      setActiveParent(null);
      setActiveChild(null);
    }, 150); // 150ms delay before closing
  }, []);

  const handleParentHover = useCallback((parentId: string) => {
    setActiveParent(parentId);
    setActiveChild(null);
  }, []);

  const handleChildHover = useCallback((childId: string) => {
    setActiveChild(childId);
  }, []);

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      setIsMegaMenuOpen(false);
      setActiveParent(null);
      setActiveChild(null);
      router.push(`/shop?category=${categoryId}`);
    },
    [router]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (megaMenuTimeoutRef.current) {
        clearTimeout(megaMenuTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-white/10 container mx-auto items-center py-2 rounded-b-md MyFont shadow-md">
        <div className="mx-auto px-6">
          <div className="flex items-center justify-between h-11">
            {/* Logo */}
            <Link
              href="/"
              className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 flex items-center text-xl font-semibold tracking-wide"
              aria-label="Broyal"
            >
              BROYAL
            </Link>

            {/* Navigation Items (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) =>
                item === "Shop" ? (
                  <div
                    key={item}
                    className="relative"
                    onMouseEnter={handleMegaMenuEnter}
                    onMouseLeave={handleMegaMenuLeave}
                  >
                    <button
                      className={`text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 text-md font-semibold py-2 ${
                        isMegaMenuOpen ? "text-navbar-text-hover" : ""
                      }`}
                    >
                      {item}
                    </button>
                  </div>
                ) : (
                  <Link
                    key={item}
                    href={`/${item
                      .toLowerCase()
                      .replace(/ & /g, "-")
                      .replace(/ /g, "-")}`}
                    className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 text-md font-semibold"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>

            {/* Utility Icons */}
            <div className="flex items-center space-x-5">
              <button
                className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* Cart Icon with Badge */}
              <Link
                href="/cart"
                className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 relative"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {isLoggedIn && cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </Link>

              {/* User Profile / Login */}
              {isLoggedIn ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 flex items-center gap-2"
                    aria-label="User profile"
                    title={profileData?.user?.name || "User Profile"}
                  >
                    <User className="h-5 w-5" strokeWidth={1.5} />
                    {profileData?.user?.name && (
                      <span className="text-sm font-medium max-w-[100px] truncate">
                        {profileData.user.name.length > 15
                          ? `${profileData.user.name.substring(0, 15)}...`
                          : profileData.user.name.split(" ")[0]}
                      </span>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 text-sm font-semibold"
                >
                  Login
                </Link>
              )}

              {/* Hamburger Toggle (Mobile) */}
              <button
                className="md:hidden text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 focus:outline-none"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden flex flex-col space-y-2 py-4 animate-in fade-in slide-in-from-top-2">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={`/${item
                    .toLowerCase()
                    .replace(/ & /g, "-")
                    .replace(/ /g, "-")}`}
                  className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 text-xl font-semibold py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}

              {/* Mobile Auth Links */}
              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 text-xl font-semibold py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 text-xl font-semibold py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="text-left text-red-600 hover:text-red-700 transition-colors duration-200 text-xl font-semibold py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 text-xl font-semibold py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Apple-Style Mega Menu Dropdown */}
      <div
        className={`fixed top-[55px] left-1/2 -translate-x-1/2 z-40 container mx-auto overflow-hidden transition-all duration-300 ease-out ${
          isMegaMenuOpen
            ? "opacity-100 max-h-[500px] pointer-events-auto"
            : "opacity-0 max-h-0 pointer-events-none"
        }`}
        onMouseEnter={handleMegaMenuEnter}
        onMouseLeave={handleMegaMenuLeave}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-white shadow-xl border border-gray-100 rounded-b-lg transition-transform duration-300 ease-out ${
            isMegaMenuOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        />

        {/* Content */}
        <div
          className={`relative px-8 py-8 transition-all duration-300 ease-out ${
            isMegaMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="grid grid-cols-3 gap-8">
            {/* Column 1: Parent Categories */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Categories
              </h3>
              {categoryHierarchy.map((parent) => (
                <button
                  key={parent._id}
                  onMouseEnter={() => handleParentHover(parent._id)}
                  onClick={() => handleCategoryClick(parent._id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                    activeParent === parent._id
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="font-medium">{parent.name}</span>
                  {parent.children.length > 0 && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeParent === parent._id
                          ? "translate-x-1 text-gray-900"
                          : "text-gray-400 group-hover:translate-x-1"
                      }`}
                    />
                  )}
                </button>
              ))}

              {/* View All Link */}
              <Link
                href="/shop"
                className="block px-4 py-3 mt-4 text-black font-semibold hover:underline transition-colors"
                onClick={() => setIsMegaMenuOpen(false)}
              >
                View All Products →
              </Link>
            </div>

            {/* Column 2: Child Categories */}
            <div
              className={`space-y-1 transition-opacity duration-200 ${
                activeParentChildren.length > 0 ? "opacity-100" : "opacity-30"
              }`}
            >
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {activeParent
                  ? categoryHierarchy.find((c) => c._id === activeParent)?.name
                  : "Select a Category"}
              </h3>
              {activeParentChildren.length > 0 ? (
                activeParentChildren.map((child) => (
                  <button
                    key={child._id}
                    onMouseEnter={() => handleChildHover(child._id)}
                    onClick={() => handleCategoryClick(child._id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                      activeChild === child._id
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="font-medium">{child.name}</span>
                    {child.children.length > 0 && (
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeChild === child._id
                            ? "translate-x-1 text-gray-900"
                            : "text-gray-400 group-hover:translate-x-1"
                        }`}
                      />
                    )}
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-sm px-4">
                  Hover over a category to see subcategories
                </p>
              )}
            </div>

            {/* Column 3: Sub-child Categories */}
            <div
              className={`space-y-1 transition-opacity duration-200 ${
                activeChildChildren.length > 0 ? "opacity-100" : "opacity-30"
              }`}
            >
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {activeChild
                  ? activeParentChildren.find((c) => c._id === activeChild)
                      ?.name
                  : "Select Subcategory"}
              </h3>
              {activeChildChildren.length > 0 ? (
                activeChildChildren.map((subChild) => (
                  <button
                    key={subChild._id}
                    onClick={() => handleCategoryClick(subChild._id)}
                    className="w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                  >
                    <span className="font-medium">{subChild.name}</span>
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-sm px-4">
                  {activeChild
                    ? "No further subcategories"
                    : "Hover to explore more"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
