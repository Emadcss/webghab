"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Smartphone,
  Tablet,
  Headphones,
  Watch,
  Gamepad2,
  ChevronLeft,
  LayoutGrid,
  ArrowRight,
  ChevronRight,
  Laptop,
  Shield,
  Zap,
  Speaker,
  Cpu,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Category } from "../types";
import { useRouter } from "next/navigation";

const iconMap: any = {
  Smartphone,
  Tablet,
  Headphones,
  Watch,
  Gamepad2,
  Laptop,
  Shield,
  Zap,
  Speaker,
  Cpu,
};

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (cat: Category | null) => void; // null رو هم قبول کن
}

const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
  isOpen,
  onClose,
  onCategorySelect,
}) => {
  const { categories } = useApp();
  const [navStack, setNavStack] = useState<Category[][]>([categories]);
  const [titleStack, setTitleStack] = useState<string[]>(["دسته‌بندی‌ها"]);

  useEffect(() => {
    if (isOpen) {
      setNavStack([categories]);
      setTitleStack(["دسته‌بندی‌ها"]);
    }
  }, [isOpen, categories]);

  const currentLevel = navStack[navStack.length - 1];
  const currentTitle = titleStack[titleStack.length - 1];
  const router = useRouter();

  const handleDrillDown = (cat: Category) => {
    if (cat.children && cat.children.length > 0) {
      setNavStack([...navStack, cat.children]);
      setTitleStack([...titleStack, cat.title]);
    } else {
      router.push(
        "/../components/CatalogView?category=${encodeURIComponent(cat.title)}",
      );
      onClose();
    }
  };

  const handleGoBack = () => {
    if (navStack.length > 1) {
      setNavStack(navStack.slice(0, -1));
      setTitleStack(titleStack.slice(0, -1));
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[200] transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
      {/* Overlay شیشه‌ای تیره */}
      <div className="drawer-overlay absolute inset-0" onClick={onClose} />

      {/* Drawer اصلی */}
      <div
        className={`glass-drawer absolute right-0 top-0 h-full w-[85%] max-w-sm shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col overflow-hidden`}>
        {/* Header شیشه‌ای */}
        <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between bg-white/10 dark:bg-black/20 backdrop-blur-lg">
          <div className="flex items-center gap-3 md:gap-4">
            {navStack.length > 1 ? (
              <button
                onClick={handleGoBack}
                className="p-2.5 md:p-3 bg-brand/15 text-brand rounded-xl hover:bg-brand hover:text-white transition-all active:scale-95">
                <ArrowRight size={20} className="md:size-22" />
              </button>
            ) : (
              <div className="bg-brand/15 p-2.5 md:p-3 rounded-xl text-brand">
                <LayoutGrid size={20} className="md:size-22" />
              </div>
            )}
            <div>
              <h2 className="text-base md:text-lg font-black line-clamp-1 text-primary dark:text-white">
                {currentTitle}
              </h2>
              {navStack.length > 1 && (
                <p className="text-[8px] md:text-[9px] font-black text-brand uppercase tracking-[1.5px] md:tracking-[2px] mt-0.5">
                  WEBGHAB
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 md:p-3 bg-white/10 dark:bg-white/5 rounded-xl text-muted hover:text-brand transition-colors active:scale-95">
            <X size={20} className="md:size-22" />
          </button>
        </div>

        {/* لیست دسته‌ها */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            {currentLevel.map((cat) => {
              const Icon = iconMap[cat.icon] || Smartphone;
              const hasChildren = cat.children && cat.children.length > 0;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleDrillDown(cat)}
                  className={`p-4 md:p-5 rounded-2xl md:rounded-3xl transition-all cursor-pointer group active:scale-[0.98] ${
                    hasChildren
                      ? "bg-white/8 dark:bg-white/5 border border-white/10 hover:bg-white/15 dark:hover:bg-white/10"
                      : "bg-brand/15 border border-brand/20 hover:bg-brand/25"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
                          hasChildren
                            ? "bg-white/15 dark:bg-black/25 text-brand"
                            : "bg-brand text-white"
                        }`}>
                        <Icon size={18} className="md:size-20" />
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-black text-sm md:text-base block ${
                            hasChildren
                              ? "text-black dark:text-white"
                              : "text-brand"
                          }`}>
                          {cat.title}
                        </span>
                        {hasChildren && (
                          <span className="text-[8px] md:text-[9px] font-bold text-muted/80 dark:text-muted uppercase tracking-widest">
                            {cat.children?.length} زیرمجموعه
                          </span>
                        )}
                      </div>
                    </div>
                    {hasChildren ? (
                      <ChevronLeft
                        size={18}
                        className="text-muted/70 group-hover:text-brand transition-transform group-hover:translate-x-[-4px] md:size-20"
                      />
                    ) : (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand/15 flex items-center justify-center text-brand">
                        <ChevronLeft size={14} className="md:size-16" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* دکمه کاتالوگ */}
          <div className="mt-8 md:mt-10">
            <div className="p-5 md:p-6 bg-linear-to-br from-brand/25 to-brand/15 dark:from-brand/35 dark:to-brand/25 rounded-[28px] text-center shadow-xl group cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-125 transition-transform">
                  <LayoutGrid size={120} className="md:size-140" />
                </div>
              </div>
              <p className="text-[9px] md:text-[10px] font-black text-white/60 dark:text-white/50 uppercase mb-2">
                دسترسی سریع
              </p>
              <h4 className="text-white dark:text-white font-black text-base md:text-lg mb-3 md:mb-4">
                مشاهده تمام محصولات {currentTitle}
              </h4>
              <button
                onClick={() => {
                  const categoryName = currentTitle;
                  if (categoryName && categoryName !== "دسته‌بندی‌ها") {
                    router.push(
                      `/catalog?category=${encodeURIComponent(categoryName)}`,
                    );
                  } else {
                    router.push("/catalog");
                  }
                  onClose();
                }}
                className="w-full py-3 md:py-4 bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-2xl text-[10px] md:text-xs font-black text-white border border-white/20 hover:bg-white/30 transition-all active:scale-95">
                {currentTitle === "دسته‌بندی‌ها"
                  ? "ورود به کل کاتالوگ"
                  : `ورود به محصولات ${currentTitle}`}
              </button>
            </div>
          </div>
        </div>

        {/* بخش پایین */}
        <div className="p-5 md:p-6 border-t border-white/10 bg-white/5 dark:bg-black/25 backdrop-blur-md">
          <div className="flex items-center gap-3 md:gap-4 opacity-70">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[1.5px] md:tracking-[2px]">
              سیستم‌ها فعال
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDrawer;
