"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { toPersianDigitsGlobal } from "../utils/helpers";
import { ArrowLeft } from "lucide-react";

const HeroCarousel: React.FC = () => {
  const { appearance } = useApp();
  const slides = appearance.heroSlides;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(
      () => setActive((prev) => (prev + 1) % slides.length),
      7000,
    );
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-[220px] sm:h-[240px] md:h-[280px] lg:h-[300px] overflow-hidden group shadow-2xl">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            i === active
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105 pointer-events-none"
          }`}>
          {/* پس‌زمینه تصویر کامل */}
          <div className="absolute inset-0 z-0">
            <img
              src={slide.image}
              className="w-full h-full object-cover brightness-75"
              alt={slide.title}
            />
            {/* گرادیان برای خوانایی متن */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* محتوا */}
          <div className="relative z-20 w-full h-full px-5 sm:px-8 md:px-12 lg:px-16 flex flex-col justify-center items-center text-center text-white">
            <div
              className={`transition-all duration-700 delay-300 transform ${
                i === active
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-2 md:mb-3 leading-tight drop-shadow-2xl">
                {toPersianDigitsGlobal(slide.title)}
              </h2>
              <p className="text-xs sm:text-sm md:text-base opacity-90 max-w-md lg:max-w-xl mb-4 md:mb-5 leading-relaxed font-medium">
                {toPersianDigitsGlobal(slide.desc)}
              </p>
              <button
                onClick={() => (window.location.href = slide.link)}
                className="glass-island bg-white/20 px-6 py-2 md:px-8 md:py-2.5 rounded-full font-black text-xs md:text-sm hover:bg-white hover:text-primary transition-all flex items-center gap-2 mx-auto backdrop-blur-md">
                مشاهده محصول <ArrowLeft size={8} className="md:size-8" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination - پایین‌تر و بزرگ‌تر برای full-width */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === active ? "w-6 md:w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
