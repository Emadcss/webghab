"use client";

import React, { useState } from "react";
import { Home, ShoppingCart, User, BarChart3, LayoutGrid } from "lucide-react";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";
import { toPersianDigits } from "../utils/helpers";

const BottomNav: React.FC<{
  onGoHome: () => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenCategories: () => void;
  onOpenAdmin: () => void;
  onOpenUserPanel: () => void;
  onOpenComparison: () => void;
}> = ({
  onGoHome,
  onOpenCart,
  onOpenAuth,
  onOpenCategories,
  onOpenAdmin,
  onOpenUserPanel,
  onOpenComparison,
}) => {
  const { user, cart } = useApp();
  const [activeTab, setActiveTab] = useState("home");

  const isAdmin = user?.role === UserRole.ADMIN;

  const handleNav = (tab: string, action: () => void) => {
    setActiveTab(tab);
    action();
    if ("vibrate" in navigator) navigator.vibrate(20);
  };

  return (
    <div className="lg:hidden fixed bottom-6 inset-x-4 z-[100] safe-bottom">
      <nav className="glass-mega px-4 py-3 flex items-center justify-around rounded-[32px]">
        <button
          onClick={() => handleNav("home", onGoHome)}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === "home" ? "text-brand scale-110" : "text-muted"}`}>
          <Home size={22} strokeWidth={activeTab === "home" ? 2.5 : 2} />
          <span className="text-[8px] font-black uppercase tracking-widest">
            خانه
          </span>
        </button>

        <button
          onClick={() => handleNav("categories", onOpenCategories)}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === "categories" ? "text-brand" : "text-muted"}`}>
          <LayoutGrid size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest">
            دسته‌ها
          </span>
        </button>

        <div className="relative -mt-14">
          <button
            onClick={() => handleNav("cart", onOpenCart)}
            className="bg-brand text-white p-5 rounded-full shadow-2xl ring-8 ring-[#f0f2f5]/70 dark:ring-[#030308]/70 ring-brand-/20 dark:ring-brand/10 transform active:scale-90  transition-all duration-200 ease-out hover:scale-105 flex items-center justify-center">
            <ShoppingCart size={24} strokeWidth={2.5} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-brand text-[9px] font-black w-6 h-6 rounded-full border-2 border-brand flex items-center justify-center">
                {toPersianDigits(cart.length)}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={() => handleNav("compare", onOpenComparison)}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === "compare" ? "text-brand" : "text-muted"}`}>
          <BarChart3 size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest">
            مقایسه
          </span>
        </button>

        <button
          onClick={() => {
            if (!user?.isLoggedIn) handleNav("user", onOpenAuth);
            else {
              setActiveTab("user");
              if (isAdmin) onOpenAdmin();
              else onOpenUserPanel();
            }
          }}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === "user" ? "text-brand" : "text-muted"}`}>
          <User size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest">
            {user?.isLoggedIn ? "پنل" : "ورود"}
          </span>
        </button>
      </nav>
    </div>
  );
};

export default BottomNav;
