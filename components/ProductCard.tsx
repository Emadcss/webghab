"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Product, UserRole } from "../types";
import { useApp } from "../context/AppContext";
import {
  formatPrice,
  toPersianDigits,
  getProductBestPrice,
} from "../utils/helpers";
import { Star, ShoppingCart, Heart, ShieldCheck, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { user, addToCart, toggleWishlist } = useApp();
  const isPartner = user?.role === UserRole.PARTNER;
  const priceInfo = getProductBestPrice(product, isPartner);
  const isWishlisted = user?.wishlist.includes(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, priceInfo.variantId);
    if ("vibrate" in navigator) navigator.vibrate(10);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      className="glass-island p-4 md:p-6 rounded-island flex flex-col items-center group relative h-full cursor-pointer">
      {/* Badges */}
      <div className="absolute top-4 right-4 z-10">
        {priceInfo.discountPercentage > 0 && (
          <span className="bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
            {toPersianDigits(priceInfo.discountPercentage)}٪
          </span>
        )}
      </div>

      <button
        onClick={handleWishlist}
        className="absolute top-4 left-4 z-10 p-2 glass-island rounded-full text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
        <Heart
          size={16}
          fill={isWishlisted ? "currentColor" : "none"}
          className={isWishlisted ? "text-red-500" : ""}
        />
      </button>

      {/* Image Area */}
      <div className="w-full aspect-square bg-gray-100/50 dark:bg-white/5 rounded-[2.5rem] mb-6 overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center text-center w-full">
        <h3 className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 mb-2 min-h-[40px]">
          {product.name}
        </h3>

        <p className="text-brand font-black text-sm md:text-lg mb-6">
          {formatPrice(priceInfo.finalPrice)}
          <span className="text-[10px] mr-1 opacity-60">تومان</span>
        </p>

        <button
          onClick={handleQuickAdd}
          className="w-full bg-white/50 dark:bg-white/10 py-3 rounded-full text-[10px] font-bold hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-2">
          <Plus size={14} />
          افزودن به سبد
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
