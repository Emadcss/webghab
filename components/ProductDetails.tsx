
"use client";

import React, { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { Product, UserRole } from '../types';
import { useApp } from '../context/AppContext';
import { formatPrice, toPersianDigits, toPersianDigitsGlobal } from '../utils/helpers';
import { 
  ArrowRight, ShoppingBag, ShieldCheck, 
  Heart, ChevronDown, Plus, Minus, BarChart3, CheckCircle2, AlertTriangle, MessageSquare,
  Star
} from 'lucide-react';
import ProductComments from './ProductComments';
import ProductCard from './ProductCard';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onGoToCompare: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onGoToCompare }) => {
  // Destructured products from useApp to fix the error on line 30
  const { user, addToCart, addToComparison, comparisonList, comments, getSimilarProducts, toggleWishlist, products } = useApp();
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedWarranty, setSelectedWarranty] = useState<string>('');
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'review' | 'comments'>('review');

  const productComments = comments.filter(c => c.productId === product.id);
  const similarProducts = useMemo(() => getSimilarProducts(product), [product, products]);

  const isWishlisted = user?.wishlist?.includes(product.id) || false;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const cheapest = [...product.variants].sort((a, b) => a.price - b.price)[0];
      setSelectedColor(cheapest.colorName);
      setSelectedWarranty(cheapest.warrantyName);
    } else {
      setSelectedColor(product.selectedColors?.[0]?.name || '');
      setSelectedWarranty(product.selectedWarranties?.[0] || '');
    }
  }, [product]);

  return (
    <div className="animate-slide-in pb-32 lg:pb-20">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-primary dark:text-white font-black text-sm hover:text-brand transition-colors group">
          <div className="bg-white dark:bg-white/5 p-2 rounded-xl shadow-sm group-hover:bg-brand transition-all"><ArrowRight size={20} /></div>
          برگشت به کاتالوگ
        </button>
        <div className="flex gap-2">
          <button onClick={() => { addToComparison(product); onGoToCompare(); }} className={`p-3 rounded-2xl transition-all border border-muted/10 shadow-sm ${comparisonList.some(p=>p.id===product.id) ? 'bg-brand text-white' : 'bg-white dark:bg-white/5'}`}>
            <BarChart3 size={20} />
          </button>
          <button onClick={() => toggleWishlist(product.id)} className={`p-3 rounded-2xl transition-all border border-muted/10 shadow-sm ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white dark:bg-white/5'}`}>
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="relative aspect-square rounded-[40px] overflow-hidden bg-white dark:bg-white/5 border border-muted/20 shadow-2xl">
             <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[3px] text-brand">{product.category}</span>
            <h1 className="text-3xl md:text-5xl font-black text-primary dark:text-white mt-1 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5"><Star size={16} className="fill-brand text-brand" /><span className="text-sm font-black">{toPersianDigits(product.rating)}</span></div>
            </div>
          </div>

          {/* Pricing & Add to Cart Section */}
          <div className="bg-primary dark:bg-black p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl">
            <div className="text-right w-full md:w-auto">
               <div className="flex items-center gap-3">
                 <span className="text-4xl font-black text-white">{formatPrice(product.price * quantity)}</span>
                 <span className="text-[10px] font-bold text-white/60">تومان</span>
               </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center bg-white/10 rounded-2xl p-1">
                <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-white hover:text-brand"><Plus size={18} /></button>
                <span className="px-4 font-black text-white w-10 text-center text-lg">{toPersianDigits(quantity)}</span>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-white hover:text-brand"><Minus size={18} /></button>
              </div>
              <button 
                onClick={() => addToCart(product)} 
                disabled={product.stock <= 0} 
                className="flex-1 md:flex-none bg-brand text-primary px-12 py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <ShoppingBag size={22} /> {product.stock > 0 ? 'خرید آنلاین' : 'ناموجود'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
         <div className="mt-32">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h2 className="text-2xl font-black">محصولات مشابه</h2>
                  <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-widest">Recommended Products</p>
               </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {similarProducts.map(p => (
                 <ProductCard key={p.id} product={p} onClick={() => onBack()} />
               ))}
            </div>
         </div>
      )}

      {/* Tabs... */}
      <div className="mt-24">
        <div className="flex gap-10 border-b border-muted/10 mb-12">
          {['review', 'specs', 'comments'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-5 text-[11px] font-black transition-all border-b-2 uppercase ${activeTab === tab ? 'text-brand border-brand' : 'text-muted border-transparent'}`}>
              {tab === 'review' ? 'بررسی تخصصی' : tab === 'specs' ? 'مشخصات فنی' : 'نظرات کاربران'}
            </button>
          ))}
        </div>
        <div>
          {activeTab === 'specs' && product.specs && (
             <div className="bg-white dark:bg-white/5 p-10 rounded-[48px] border border-muted/10 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(product.specs).map(([k,v], i) => (
                  <div key={i} className="flex justify-between py-5 border-b border-muted/5 font-bold text-xs">
                    <span className="text-muted">{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
             </div>
          )}
          {activeTab === 'comments' && <ProductComments product={product} />}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
