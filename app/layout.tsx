import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
export const metadata: Metadata = {
  title: "Web Ghab | وب‌قاب - مرجع تخصصی موبایل و لوازم جانبی لوکس",
  description:
    "فروشگاه اینترنتی وب‌قاب؛ بررسی، مقایسه و خرید آنلاین انواع گوشی موبایل، تبلت و لوازم جانبی اورجینال با گارانتی معتبر و بهترین قیمت بازار.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">
        <AppProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
