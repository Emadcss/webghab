// app/not-found.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-navy flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* آیکون بزرگ یا انیمیشن */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-brand/10 flex items-center justify-center animate-pulse">
            <Search size={64} className="text-brand opacity-70" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-8xl font-black text-brand/30">
              404
            </span>
          </div>
        </div>

        {/* متن اصلی */}
        <h1 className="text-4xl md:text-6xl font-black text-primary dark:text-white mb-4">
          صفحه‌ای که دنبالشی پیدا نشد
        </h1>

        <p className="text-lg md:text-xl text-muted mb-10 leading-relaxed">
          ممکنه آدرس اشتباه وارد شده باشه یا صفحه حذف شده باشه.
          <br />
          بیا برگردیم به جای امن!
        </p>

        {/* دکمه‌های اقدام */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand text-primary font-black rounded-2xl hover:bg-brand/90 transition-all shadow-lg hover:shadow-xl active:scale-95">
            <Home size={20} />
            بازگشت به خانه
          </Link>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 dark:bg-white/5 border border-muted/20 text-primary dark:text-white font-black rounded-2xl hover:bg-white/20 transition-all">
            <ArrowLeft size={20} />
            برگشت به صفحه قبلی
          </button>
        </div>

        {/* پیشنهاد جستجو */}
        <div className="mt-12 text-muted text-sm">
          یا می‌تونی دوباره جستجو کنی:
          <Link href="/catalog" className="text-brand hover:underline mr-1">
            برو به کاتالوگ
          </Link>
        </div>
      </div>
    </div>
  );
}
