
"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { Zap, ChevronLeft, ArrowLeft, Timer, Sparkles } from 'lucide-react';
import { toPersianDigits, toPersianDigitsGlobal } from '../utils/helpers';

const SpecialOffer: React.FC<{ onProductClick?: (p: any) => void }> = ({ onProductClick }) => {
  const { appearance, products } = useApp();
  const config = appearance.specialOffer;
  const [timeStr, setTimeStr] = useState("00:00:00");

  useEffect(() => {
    if (!config.showTimer) return;
    const calculateTime = () => {
      const now = new Date();
      const nextBlock = (Math.floor(now.getHours() / 4) + 1) * 4;
      const target = new Date();
      target.setHours(nextBlock, 0, 0, 0);
      const diff = target.getTime() - now.getTime();
      const h = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
      const m = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
      const s = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeStr(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };
    const timer = setInterval(calculateTime, 1000);
    calculateTime();
    return () => clearInterval(timer);
  }, [config.showTimer]);

  const offerProducts = products.filter(p => config.productIds.includes(p.id));

  if (!appearance.layout.showSpecialOffers) return null;

  return (
    <div className="glass-island rounded-[3.5rem] p-4 md:p-8 overflow-hidden flex flex-col md:flex-row gap-6 relative">
      {/* Sidebar */}
      <div className="flex flex-col items-center justify-center text-center p-4 md:w-56 shrink-0 text-primary dark:text-white">
         <div className="mb-4 relative">
            <Sparkles size={48} className="text-brand opacity-20 absolute -top-4 -right-4 animate-pulse" />
            <Zap size={64} fill="currentColor" className="text-brand animate-bounce" />
         </div>
         <h2 className="text-xl md:text-3xl font-black mb-1">{toPersianDigitsGlobal(config.title)}</h2>
         <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-8">{toPersianDigitsGlobal(config.subtitle)}</p>
         
         {config.showTimer && (
           <div className="flex flex-col items-center bg-brand/10 dark:bg-brand/20 backdrop-blur-md px-6 py-4 rounded-3xl mb-8 border border-brand/20">
              <span className="text-[8px] font-black uppercase mb-1 opacity-60">زمان باقی‌مانده:</span>
              <div className="flex items-center gap-2 text-2xl font-black tabular-nums text-brand" dir="ltr">
                 <Timer size={18} />
                 <span>{toPersianDigits(timeStr)}</span>
              </div>
           </div>
         )}
         
         <button className="flex items-center gap-2 text-[11px] font-black hover:translate-x-[-4px] transition-transform text-brand">
           مشاهده همه <ChevronLeft size={18} />
         </button>
      </div>

      {/* Products Horizontal Scroll */}
      <div className="flex-1 overflow-x-auto no-scrollbar py-4">
         <div className="flex gap-4">
            {offerProducts.map((product, idx) => (
              <div key={product.id} className="w-[220px] md:w-[260px] shrink-0">
                <ProductCard product={product} onClick={() => onProductClick?.(product)} />
              </div>
            ))}
            <div className="w-[180px] md:w-[220px] shrink-0 glass-island flex flex-col items-center justify-center rounded-island text-primary dark:text-white group cursor-pointer hover:bg-brand/10 transition-all border-2 border-dashed border-brand/20">
               <div className="w-14 h-14 rounded-full border-2 border-brand flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-brand">
                  <ArrowLeft size={28} />
               </div>
               <span className="text-xs font-black">مشاهده همه</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
