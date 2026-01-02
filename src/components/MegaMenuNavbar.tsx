"use client";
import { Menu, X, Search, ShoppingBag, User, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useGetProfileQuery } from "@/store/slices/authSlice";
import { useGetCartQuery } from "@/store/slices/cartSlice";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navItems = ["Shop", "Men's", "Women's", "Tabi's", "About", "Contact"];

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-white/10 container mx-auto items-center py-2 rounded-b-md MyFont shadow-md">
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between h-11">
          {/* Logo */}
          <Link
            href="/"
            className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 flex items-center text-xl font-semibold tracking-wide"
            aria-label="Broyal"
          >
            {/* <Image src="/broyal.png" alt="Broyal Logo" width={150} height={40} className="invert" /> */}
            BROYAL
          </Link>

          {/* Navigation Items (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
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
            ))}
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
                  title={profileData?.user?.name || "User Profile"} // Tooltip shows full name
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
  );
};

export default Navbar;
