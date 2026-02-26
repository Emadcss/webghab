"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  ArrowRight,
  ShoppingBag,
  Info,
  Trash2,
  Plus,
  Search,
} from "lucide-react";
import { formatPrice, toPersianDigits } from "../utils/helpers";
import { Product } from "../types";

interface ComparisonViewProps {
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  onBack,
  onProductClick,
}) => {
  const {
    comparisonList,
    removeFromComparison,
    addToComparison,
    addToCart,
    products,
  } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

  const currentCategory =
    comparisonList.length > 0 ? comparisonList[0].category : null;

  const availableToCompare = products.filter(
    (p) =>
      (!currentCategory || p.category === currentCategory) &&
      !comparisonList.find((cp) => cp.id === p.id) &&
      p.name.toLowerCase().includes(modalSearch.toLowerCase()),
  );

  const specKeys: string[] = Array.from(
    new Set(comparisonList.flatMap((p) => Object.keys(p.specs || {}))),
  );

  const handleAddProduct = (product: Product) => {
    const error = addToComparison(product);
    if (error) {
      alert(error);
    } else {
      setShowAddModal(false);
      setModalSearch("");
    }
  };

  if (comparisonList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-slide-in">
        <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center mb-6 text-muted">
          <Info size={48} />
        </div>
        <h2 className="text-xl font-black mb-4 text-center">
          لیست مقایسه شما خالی است
        </h2>
        <p className="text-sm text-muted mb-8 text-center max-w-xs">
          برای مقایسه تخصصی محصولات، حداقل ۲ کالا از یک دسته‌بندی را اضافه کنید.
        </p>
        <button
          onClick={onBack}
          className="bg-brand text-primary px-10 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
          برگشت به فروشگاه <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="animate-slide-in pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary dark:text-white font-black hover:text-brand transition-colors self-start md:self-auto group">
          <div className="bg-white dark:bg-white/5 p-2 rounded-xl shadow-sm group-hover:bg-brand transition-all">
            <ArrowRight size={20} />
          </div>
          بازگشت به کاتالوگ
        </button>
        <div className="text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-black">
            میز مقایسه تخصصی وب‌قاب
          </h1>
          <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">
            Advanced Comparison Matrix
          </p>
        </div>
      </div>

      <div className="relative overflow-x-auto no-scrollbar border border-muted/20 rounded-[32px] md:rounded-[40px] bg-white dark:bg-[#000038]/50 backdrop-blur-xl">
        <div className="min-w-[800px] md:min-w-full">
          <div className="grid grid-cols-[180px_repeat(3,1fr)] gap-0">
            <div className="bg-slate-50 dark:bg-black/20 border-l border-muted/10 sticky right-0 z-20 backdrop-blur-md">
              <div className="h-[220px] md:h-[320px] p-6 md:p-8 flex flex-col justify-end">
                <span className="text-[10px] font-black uppercase tracking-[3px] text-muted">
                  مشخصات فنی
                </span>
              </div>
              <div className="p-4 md:p-6 border-t border-muted/10 h-16 md:h-20 flex items-center bg-brand/5">
                <span className="text-[11px] font-black">قیمت در وب‌قاب</span>
              </div>
              {specKeys.map((key) => (
                <div
                  key={key}
                  className="p-4 md:p-6 border-t border-muted/10 h-16 md:h-20 flex items-center">
                  <span className="text-[10px] md:text-[11px] font-black text-muted">
                    {key}
                  </span>
                </div>
              ))}
              <div className="p-4 md:p-6 border-t border-muted/10 h-20 md:h-24"></div>
            </div>

            {comparisonList.map((product) => (
              <div
                key={product.id}
                className="relative border-l border-muted/10 group last:border-l-0 hover:bg-slate-50/30 dark:hover:bg-white/5 transition-colors">
                <button
                  onClick={() => removeFromComparison(product.id)}
                  className="absolute top-4 left-4 z-10 p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm">
                  <Trash2 size={14} />
                </button>

                <div
                  className="p-4 md:p-8 h-[220px] md:h-[320px] flex flex-col items-center justify-center text-center cursor-pointer"
                  onClick={() => onProductClick(product)}>
                  <div className="w-20 h-20 md:w-36 md:h-36 mb-4 md:mb-6 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl bg-surface border border-muted/5">
                    <img
                      src={product.image}
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform"
                      alt={product.name}
                    />
                  </div>
                  <h3 className="text-[10px] md:text-sm font-black line-clamp-2 leading-relaxed">
                    {product.name}
                  </h3>
                </div>

                <div className="p-4 md:p-6 border-t border-muted/10 h-16 md:h-20 flex flex-col justify-center items-center bg-slate-100/10 dark:bg-white/5">
                  <span className="text-[11px] md:text-base font-black text-primary dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-[7px] font-bold text-muted uppercase">
                    Toman
                  </span>
                </div>

                {specKeys.map((key) => (
                  <div
                    key={key}
                    className="p-4 md:p-6 border-t border-muted/10 h-16 md:h-20 flex items-center justify-center text-center">
                    <span className="text-[10px] md:text-xs font-bold">
                      {product.specs?.[key]
                        ? toPersianDigits(product.specs[key])
                        : "---"}
                    </span>
                  </div>
                ))}

                <div className="p-4 md:p-6 border-t border-muted/10 h-20 md:h-24 flex items-center justify-center">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-primary dark:bg-brand text-white dark:text-primary py-3 rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg">
                    <ShoppingBag size={14} /> خرید کالا
                  </button>
                </div>
              </div>
            ))}

            {Array.from({ length: Math.max(0, 3 - comparisonList.length) }).map(
              (_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex flex-col items-center justify-center p-6 border-l border-muted/10 bg-slate-50/10 dark:bg-black/5 last:border-l-0">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="w-14 h-14 md:w-20 md:h-20 rounded-[28px] border-2 border-dashed border-muted/30 flex items-center justify-center text-muted hover:border-brand hover:text-brand hover:bg-brand/5 transition-all group">
                    <Plus
                      size={24}
                      className="group-hover:rotate-90 transition-transform duration-500"
                    />
                  </button>
                  <p className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-widest mt-4">
                    افزودن کالا
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-[#000038] rounded-[40px] shadow-2xl border border-white/10 overflow-hidden animate-slide-in flex flex-col max-h-[85vh]">
            <div className="p-6 md:p-8 border-b border-muted/10 flex justify-between items-center bg-slate-50 dark:bg-white/5">
              <div>
                <h2 className="text-xl font-black">انتخاب محصول برای مقایسه</h2>
                <p className="text-[10px] text-muted font-bold mt-1">
                  دسته انتخابی: {currentCategory || "همه دسته‌ها"}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-muted/10 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="relative group mb-6">
                <Search
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand"
                  size={18}
                />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="جستجوی نام محصول..."
                  className="w-full bg-slate-100 dark:bg-white/5 p-4 pr-12 rounded-2xl outline-none font-bold text-sm"
                />
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[400px] no-scrollbar">
                {availableToCompare.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleAddProduct(p)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl border border-muted/5 transition-all text-right">
                    <img
                      src={p.image}
                      className="w-12 h-12 rounded-xl object-contain bg-white"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-black">{p.name}</p>
                      <p className="text-[10px] text-brand font-bold mt-1">
                        {formatPrice(p.price)} تومان
                      </p>
                    </div>
                  </button>
                ))}
                {availableToCompare.length === 0 && (
                  <p className="text-center py-10 text-muted font-bold italic">
                    کالای دیگری برای مقایسه در این دسته یافت نشد.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;
