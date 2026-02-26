"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  ChevronLeft,
  Smartphone,
  Headphones,
  Watch,
  Cpu,
  LayoutGrid,
  Tablet,
  Laptop,
  Shield,
  Zap,
  Gamepad2,
  Speaker,
  ArrowRight,
  Activity,
} from "lucide-react";
import { Category } from "../types";

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Smartphone,
  Headphones,
  Watch,
  Cpu,
  LayoutGrid,
  Tablet,
  Laptop,
  Shield,
  Zap,
  Gamepad2,
  Speaker,
  Activity,
};

const MegaMenu: React.FC = () => {
  const router = useRouter();
  const { categories } = useApp();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeSub, setActiveSub] = useState<Category | null>(null);

  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);

  if (!categories || categories.length === 0 || !activeCategory) return null;

  return (
    <div
      className="
        glass-mega
        rounded-[28px]
        w-[920px] max-w-[96vw]
        h-[540px]
        flex overflow-hidden
        shadow-2xl
        border border-white/40 dark:border-white/10
        z-[9999]
      ">
      {/* Level 0 */}
      <div className="w-[270px] glass-mega border-r border-white/20 p-6 overflow-y-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-brand/10 rounded-2xl">
            <LayoutGrid size={22} className="text-brand" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[2px] text-gray-600/75">
              دسته‌بندی‌ها
            </h4>
            <p className="text-[10px] font-bold text-brand">Catalog</p>
          </div>
        </div>

        <ul className="space-y-1.5">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Smartphone;
            const isActive = activeCategory.id === cat.id;

            return (
              <li
                key={cat.id}
                onMouseEnter={() => {
                  setActiveCategory(cat);
                  setActiveSub(null);
                }}
                className={`
                  flex items-center justify-between
                  p-4 rounded-2xl cursor-pointer
                  transition-all duration-300 group
                  ${
                    isActive
                      ? "glass-active text-brand"
                      : "hover:glass-active text-primary dark:text-white hover:text-brand"
                  }
                `}>
                <div className="flex items-center gap-4">
                  <Icon
                    size={19}
                    className={
                      isActive
                        ? "text-dark-navy"
                        : "text-brand group-hover:text-brand"
                    }
                  />
                  <span className="font-black text-sm">{cat.title}</span>
                </div>
                <ChevronLeft
                  size={15}
                  className={`transition-all ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                />
              </li>
            );
          })}
        </ul>
      </div>

      {/* Level 1 */}
      <div className="w-[270px] glass-mega border-r border-white/20 p-6 overflow-y-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-0.5 w-9 bg-brand rounded-full" />
          <h4 className="font-black text-sm text-gray-600/75 uppercase">
            زیرمجموعه‌ها
          </h4>
        </div>

        {activeCategory.children?.length > 0 ? (
          <ul className="space-y-2">
            {activeCategory.children.map((sub) => (
              <li
                key={sub.id}
                onMouseEnter={() => setActiveSub(sub)}
                className={`
                  p-4 rounded-2xl cursor-pointer
                  transition-all duration-300 flex items-center justify-between group
                  ${
                    activeSub?.id === sub.id
                      ? "glass-active text-brand font-black"
                      : "hover:glass-active text-primary dark:text-white hover:text-brand"
                  }
                `}>
                <span className="text-sm font-black">{sub.title}</span>
                <ChevronLeft
                  size={15}
                  className={`transition-all duration-300 ${
                    activeSub?.id === sub.id
                      ? "translate-x-[-6px] opacity-100"
                      : "opacity-0 group-hover:opacity-100 group-hover:translate-x-[-3px]"
                  }`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted">
            بدون زیرمجموعه
          </div>
        )}
      </div>

      {/* Level 2 */}
      <div className="flex-1 glass-mega p-8 flex flex-col overflow-hidden">
        {activeSub && activeSub.children?.length > 0 ? (
          <div className="flex-1 space-y-7 no-scrollbar">
            {activeSub.children.map((deep) => (
              <div
                key={deep.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2.5 h-2.5 m-1 bg-brand rounded-full group-hover:scale-100 transition-transform" />
                  <h5 className="font-black text-primary dark:text-white hover:text-brand transition-colors text-base">
                    {deep.title}
                  </h5>
                </div>

                {deep.children?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pr-6">
                    {deep.children.map((leaf) => (
                      <span
                        key={leaf.id}
                        className="
                          text-xs font-bold
                          px-5 py-2.5
                          bg-white/70 dark:bg-white/10
                          hover:bg-brand hover:text-white
                          border border-transparent hover:border-brand
                          rounded-2xl transition-all
                        ">
                        {leaf.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 relative rounded-3xl overflow-hidden group">
            <img
              src={
                activeCategory.image ||
                "https://images.unsplash.com/photo-1616348436168-de43ad0db179"
              }
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-8 right-8 text-right">
              <p className="text-brand text-xs font-black tracking-widest">
                COLLECTION 2026
              </p>
              <h3 className="text-4xl font-black text-white mt-2">
                {activeSub?.title || activeCategory.title}
              </h3>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            const categoryName =
              activeSub?.title || activeCategory?.title || "";
            if (categoryName) {
              router.push(
                `/catalog?category=${encodeURIComponent(categoryName)}`,
              );
            } else {
              router.push("/catalog");
            }
          }}
          className="mt-6 w-full py-4 glass-active text-sm font-black text-dark-navy hover:scale-105 transition-transform rounded-island">
          مشاهده کامل محصولات{" "}
          {activeSub?.title || activeCategory?.title || "همه دسته‌ها"}
        </button>
      </div>
    </div>
  );
};

export default MegaMenu;
