"use client";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";


import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    "Shoes",
    "Jackets",
    "Men's",
    "Women's",
    "Tabi's",
    "About",
    "Contact"
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-white/10 container mx-auto items-center py-2 rounded-b-md">
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between h-11">
          {/* Logo */}
          <a
            href="/"
            className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 flex items-center text-xl font-semibold tracking-wide"
            aria-label="Broyal"
          >
            {/* <Image src="/broyal.png" alt="Broyal Logo" width={150} height={40} className="invert" /> */}
            BROYAL
          </a>

          {/* Navigation Items (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 text-md font-semibold"
              >
                {item}
              </a>
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
            <button
              className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            </button>
            {/* Hamburger Toggle (Mobile) */}
            <button
              className="md:hidden text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 focus:outline-none"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 py-4 animate-in fade-in slide-in-from-top-2">
            {navItems.map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                className="text-navbar-text hover:text-navbar-text-hover transition-colors duration-200 text-xl font-semibold py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
