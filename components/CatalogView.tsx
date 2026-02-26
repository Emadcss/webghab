"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "../context/AppContext";
import ProductCard from "./ProductCard";
import {
  Search,
  SlidersHorizontal,
  X,
  Grid,
  List,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Product, Category } from "../types";
import { toPersianDigits, formatPrice } from "../utils/helpers";

const CatalogView: React.FC = () => {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") || "";

  const { products, categories, brands } = useApp();

  const [q, setQ] = useState("");
  const [selectedCat, setSelectedCat] = useState(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState(100000000);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedCats, setExpandedCats] = useState<string[]>([]); // برای چایلدها

  // فیلتر محصولات
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQ =
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q.toLowerCase()));
      const matchCat = !selectedCat || p.category === selectedCat;
      const matchBrand = !selectedBrand || p.brandId === selectedBrand;
      const matchPrice = p.price <= priceRange;
      return matchQ && matchCat && matchBrand && matchPrice;
    });
  }, [products, q, selectedCat, selectedBrand, priceRange]);

  // باز/بستن چایلدها
  const toggleCategory = (catTitle: string) => {
    setExpandedCats((prev) =>
      prev.includes(catTitle)
        ? prev.filter((c) => c !== catTitle)
        : [...prev, catTitle],
    );
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-navy pb-20">
      {/* هدر اصلی سایت - از Header کامپوننت استفاده می‌شه، اینجا فقط placeholder */}
      <div className="h-20 md:h-24" /> {/* فضای خالی برای هدر fixed */}
      {/* هدر کاتالوگ */}
      <header className="glass-header sticky top-0 z-50 py-3 px-4 md:px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-xl md:text-3xl font-black text-primary dark:text-white truncate">
            {selectedCat ? `محصولات ${selectedCat}` : "کاتالوگ کامل"}
          </h1>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex bg-white/10 dark:bg-white/5 rounded-full p-1 border border-white/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-full transition-all ${viewMode === "grid" ? "bg-brand text-white" : "text-muted hover:text-brand"}`}>
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-full transition-all ${viewMode === "list" ? "bg-brand text-white" : "text-muted hover:text-brand"}`}>
                <List size={18} />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden glass-header p-3 rounded-full">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* فیلترها - دسکتاپ */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="glass-mega p-5 md:p-6 rounded-3xl sticky top-24">
              <h3 className="font-black text-sm uppercase tracking-widest mb-5 text-muted flex items-center gap-2">
                <Filter size={16} /> فیلترها
              </h3>

              {/* دسته‌بندی درخت‌مانند */}
              <div className="mb-6">
                <label className="text-xs font-black uppercase text-muted tracking-widest block mb-3">
                  دسته‌بندی
                </label>
                <div className="flex flex-col gap-1.5">
                  {categories.map((cat) => {
                    const isExpanded = expandedCats.includes(cat.title);
                    const isSelected = selectedCat === cat.title;
                    const hasChildren = cat.children && cat.children.length > 0;

                    return (
                      <div key={cat.id}>
                        <button
                          onClick={() => {
                            setSelectedCat(isSelected ? "" : cat.title);
                            if (hasChildren) toggleCategory(cat.title);
                          }}
                          className={`w-full text-right px-4 py-3 rounded-xl text-sm transition-all flex justify-between items-center ${
                            isSelected
                              ? "bg-brand text-white"
                              : "hover:bg-white/10 dark:hover:bg-white/5"
                          }`}>
                          {cat.title}
                          {hasChildren && (
                            <ChevronDown
                              size={14}
                              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          )}
                        </button>

                        {hasChildren && isExpanded && (
                          <div className="mr-5 mt-1 flex flex-col gap-1">
                            {cat.children.map((child) => (
                              <button
                                key={child.id}
                                onClick={() => setSelectedCat(child.title)}
                                className={`text-right px-4 py-2.5 rounded-lg text-sm transition-all ${
                                  selectedCat === child.title
                                    ? "bg-brand/10 text-brand font-bold"
                                    : "hover:bg-white/5 dark:hover:bg-white/5"
                                }`}>
                                {child.title}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* برند و قیمت - ساده‌تر */}
              <div className="mb-6">
                <label className="text-xs font-black uppercase text-muted tracking-widest block mb-3">
                  برند
                </label>
                <div className="flex flex-col gap-1.5">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() =>
                        setSelectedBrand(selectedBrand === b.id ? "" : b.id)
                      }
                      className={`text-right px-4 py-3 rounded-xl text-sm transition-all ${
                        selectedBrand === b.id
                          ? "bg-brand text-white"
                          : "hover:bg-white/10 dark:hover:bg-white/5"
                      }`}>
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-muted tracking-widest block mb-3">
                  حداکثر قیمت
                </label>
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  step="1000000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-brand h-1.5 rounded-full"
                />
                <div className="text-right text-brand font-bold mt-2">
                  تا {formatPrice(priceRange)} تومان
                </div>
              </div>
            </div>
          </aside>

          {/* محتوای اصلی */}
          <main className="lg:col-span-9">
            {/* سرچ بار کوچک و زیبا */}
            <div className="relative mb-6">
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                size={18}
              />
              <input
                placeholder="جستجوی نام، برند یا مدل..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full glass-header pl-12 pr-5 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
              />
            </div>

            {/* نتایج */}
            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-5 md:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1 lg:grid-cols-2 gap-y-8" // حداقل ۴ محصول در صفحه
                }`}>
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted">
                <p className="text-lg font-medium">هیچ محصولی یافت نشد</p>
                <button
                  onClick={() => {
                    setQ("");
                    setSelectedCat("");
                    setSelectedBrand("");
                  }}
                  className="mt-4 text-brand underline">
                  نمایش همه محصولات
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      {/* Drawer فیلتر در موبایل */}
      {showFilters && (
        <div
          className="fixed inset-0 z-[300] bg-black/60 lg:hidden"
          onClick={() => setShowFilters(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-surface dark:bg-dark-navy h-[80%] rounded-t-3xl p-5 md:p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl">فیلترها</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={24} />
              </button>
            </div>

            {/* محتوای فیلترها در موبایل - همان درخت‌مانند */}
            {/* ... می‌تونی کپی کنی از بخش دسکتاپ ... */}
            <button
              onClick={() => setShowFilters(false)}
              className="w-full py-4 bg-brand text-white rounded-2xl mt-8">
              اعمال فیلترها
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogView;
