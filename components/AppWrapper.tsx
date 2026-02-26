"use client";

import React, { useState, Suspense, useEffect } from "react";
import { AppProvider, useApp } from "../context/AppContext";
import Header from "./Header";
import BottomNav from "./BottomNav";
import ProductCard from "./ProductCard";
import HeroCarousel from "./HeroCarousel";
import SpecialOffer from "./SpecialOffer";
import CartDrawer from "./CartDrawer";
import AuthModal from "./AuthModal";
import ProductDetails from "./ProductDetails";
import UserPanelEntry from "../panel/userPanel/UserPanelEntry";
import CategoryDrawer from "./CategoryDrawer";
import Notification from "./Notification";
import CheckoutView from "./CheckoutView";
import ComparisonView from "./ComparisonView";
import Footer from "./Footer";
import ShortcutSections from "./ShortcutSections";
import { Product, UserRole } from "../types";

const AdminEntry = React.lazy(() => import("../panel/AdminEntry"));

const AppContent: React.FC = () => {
  const { user, products, isDarkMode } = useApp(); // isLoading رو حذف کردیم
  const [currentView, setCurrentView] = useState<
    | "home"
    | "product-detail"
    | "user-panel"
    | "checkout"
    | "admin"
    | "comparison"
  >("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleGoHome = () => {
    setCurrentView("home");
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // حذف کامل صفحه لودینگ — حالا مستقیم محتوای اصلی نشون داده می‌شه
  if (currentView === "admin" && user?.role === UserRole.ADMIN) {
    return (
      <Suspense fallback={null}>
        <AdminEntry onClose={handleGoHome} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-24 md:pb-0 transition-colors duration-500">
      <Notification />
      <Header
        onGoHome={handleGoHome}
        onOpenAdmin={() => setCurrentView("admin")}
        onOpenUserPanel={() => setCurrentView("user-panel")}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onProductClick={(p) => {
          setSelectedProduct(p);
          setCurrentView("product-detail");
        }}
      />

      <div className="mt-12 md:space-y-16">
        <HeroCarousel />
      </div>

      {/* فاصله از هدر: کمتر و responsive */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 lg:pt-15">
        {currentView === "user-panel" ? (
          <UserPanelEntry onBack={handleGoHome} />
        ) : currentView === "comparison" ? (
          <ComparisonView
            onBack={handleGoHome}
            onProductClick={(p) => {
              setSelectedProduct(p);
              setCurrentView("product-detail");
            }}
          />
        ) : currentView === "product-detail" && selectedProduct ? (
          <ProductDetails
            product={selectedProduct}
            onBack={handleGoHome}
            onGoToCompare={() => setCurrentView("comparison")}
          />
        ) : currentView === "checkout" ? (
          <CheckoutView
            onBack={handleGoHome}
            onSuccess={() => handleGoHome()}
            onNavigateToProfile={() => setCurrentView("user-panel")}
          />
        ) : (
          <div className="space-y-12 md:space-y-16">
            <ShortcutSections />

            <SpecialOffer
              onProductClick={(p) => {
                setSelectedProduct(p);
                setCurrentView("product-detail");
              }}
            />

            <section>
              <h2 className="text-2xl md:text-3xl font-black mb-8 md:mb-10 border-r-8 border-brand pr-4 dark:text-white">
                جدیدترین‌ها
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onClick={() => {
                      setSelectedProduct(p);
                      setCurrentView("product-detail");
                    }}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav
        onGoHome={handleGoHome}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCategories={() => setIsCategoryOpen(true)}
        onOpenAdmin={() => setCurrentView("admin")}
        onOpenUserPanel={() => setCurrentView("user-panel")}
        onOpenComparison={() => setCurrentView("comparison")}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigateToCheckout={() => setCurrentView("checkout")}
        onNavigateToProfile={() => setCurrentView("user-panel")}
      />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CategoryDrawer
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
        onCategorySelect={() => {}}
      />
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default AppWrapper;
