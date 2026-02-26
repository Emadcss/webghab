"use client";

import React, { useState, useMemo, useRef, useEffect, memo } from "react";
import Image from "next/image";
import Fuse from "fuse.js";
import { Search, ShoppingCart, User, Moon, Sun } from "lucide-react";

import { useApp } from "../context/AppContext";
import useDebounce from "../hooks/useDebounce";
import { toPersianDigits, formatPrice } from "../utils/helpers";
import { Product, UserRole } from "../types";

interface HeaderProps {
  onGoHome: () => void;
  onProductClick?: (p: Product) => void;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
}

const Header: React.FC<HeaderProps> = memo(
  ({ onGoHome, onProductClick, onOpenCart, onOpenAuth }) => {
    const { user, cart, products, isDarkMode, toggleDarkMode } = useApp();

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);

    /* ==============================
       🔎  Fuse Index (فقط یک بار ساخته می‌شود)
    ============================== */
    const fuse = useMemo(() => {
      if (!products?.length) return null;

      return new Fuse(products, {
        keys: ["name", "category"],
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
    }, [products]);

    /* ==============================
       ⏳ Debounce
    ============================== */
    const debouncedQuery = useDebounce(searchQuery, 300);

    /* ==============================
       ⚡ Search Results (بدون state اضافی)
    ============================== */
    const searchResults = useMemo(() => {
      if (!fuse || debouncedQuery.trim().length < 2) return [];

      return fuse
        .search(debouncedQuery)
        .slice(0, 8)
        .map((result) => result.item);
    }, [debouncedQuery, fuse]);

    /* ==============================
       👆 Close dropdown on outside click
    ============================== */
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          searchRef.current &&
          !searchRef.current.contains(e.target as Node)
        ) {
          setIsSearchFocused(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const cartCount = useMemo(() => cart.length, [cart]);

    /* ============================== */

    return (
      <>
        <header className="fixed top-0 inset-x-0 z-50 px-4 py-3 pointer-events-none">
          <div className="container mx-auto pointer-events-auto flex items-center gap-4">
            {/* Logo */}
            <div
              onClick={onGoHome}
              className="glass-header px-4 py-2 rounded-full cursor-pointer">
              <Image
                src="/logo.svg"
                alt="وب قاب"
                width={110}
                height={46}
                priority
              />
            </div>

            {/* Search */}
            <div
              ref={searchRef}
              className="glass-header flex-1 max-w-xl rounded-full relative overflow-visible">
              <input
                type="text"
                aria-label="جستجوی کالا"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchResults.length > 0) {
                    onProductClick?.(searchResults[0]);
                  }
                }}
                placeholder="جستجوی کالا ..."
                className="w-full bg-transparent py-2.5 px-12 text-sm focus:outline-none"
              />

              <Search className="w-5 h-5 absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />

              {/* Results */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 glass-header rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-3">
                    {searchResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onProductClick?.(p);
                          setSearchQuery("");
                          setIsSearchFocused(false);
                        }}
                        className="w-full flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition-all text-right">
                        <div className="w-12 h-12 rounded-xl overflow-hidden">
                          <Image
                            src={p.image}
                            alt={p.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="text-sm font-bold line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-sm text-brand font-black mt-0.5">
                            {formatPrice(p.price)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Dark Mode */}
              <button
                aria-label="تغییر حالت تاریک"
                onClick={toggleDarkMode}
                className="glass-header w-10 h-10 rounded-full flex items-center justify-center">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Cart */}
              <button
                aria-label="سبد خرید"
                onClick={onOpenCart}
                className="glass-header w-10 h-10 rounded-full flex items-center justify-center relative">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-brand text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {toPersianDigits(cartCount)}
                  </span>
                )}
              </button>

              {/* Login */}
              {!user?.isLoggedIn && (
                <button
                  onClick={onOpenAuth}
                  className="glass-header px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold">
                  <User size={18} />
                  ورود
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Spacer */}
        <div className="h-16" />
      </>
    );
  },
);

Header.displayName = "Header";
export default Header;
