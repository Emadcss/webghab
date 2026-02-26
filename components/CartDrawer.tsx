
"use client";

import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, Plus, Minus, CreditCard, AlertCircle } from 'lucide-react';
import { formatPrice, toPersianDigits, getVariantInfo } from '../utils/helpers';
import { UserRole } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCheckout: () => void;
  onNavigateToProfile: (tab: any) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onNavigateToCheckout, onNavigateToProfile }) => {
  const { cart, removeFromCart, updateQuantity, user, addNotification } = useApp();
  
  const isPartner = user?.role === UserRole.PARTNER;
  
  const totals = useMemo(() => {
    return cart.reduce((acc, item) => {
      const vInfo = getVariantInfo(item, item.selectedVariantId, isPartner);
      if (!vInfo) return acc;
      const itemTotalBase = vInfo.originalPrice * item.quantity;
      const itemTotalFinal = vInfo.finalPrice * item.quantity;
      return {
        totalBase: acc.totalBase + itemTotalBase,
        totalFinal: acc.totalFinal + itemTotalFinal,
        totalDiscount: acc.totalDiscount + (itemTotalBase - itemTotalFinal)
      };
    }, { totalBase: 0, totalFinal: 0, totalDiscount: 0 });
  }, [cart, isPartner]);

  const isProfileComplete = user?.nationalId && user?.phone && user?.addresses.length > 0;

  const handleCheckoutClick = () => {
    if(!user?.isLoggedIn) {
      addNotification('لطفاً ابتدا وارد حساب خود شوید.', 'warning');
      return;
    }
    if(!isProfileComplete) {
      addNotification('لطفاً ابتدا اطلاعات پروفایل و آدرس خود را تکمیل کنید.', 'error');
      onNavigateToProfile('settings');
      onClose();
      return;
    }
    onNavigateToCheckout();
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className={`absolute left-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#08081a] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-6 md:p-8 h-full flex flex-col safe-bottom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-black flex items-center gap-3">
                <ShoppingBag size={24} className="text-brand" /> سبد خرید لوکس
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-5 no-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-40">
                <ShoppingBag size={64} strokeWidth={1} />
                <p className="mt-4 font-bold italic">سبد شما خالی است.</p>
              </div>
            ) : (
              <>
                {cart.map(item => {
                  const vInfo = getVariantInfo(item, item.selectedVariantId, isPartner);
                  if (!vInfo) return null;
                  return (
                    <div key={item.selectedVariantId} className="bg-white dark:bg-white/5 p-4 rounded-3xl border border-muted/10 flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-surface dark:bg-black">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[11px] font-black line-clamp-1 mb-1">{item.name}</h4>
                        <p className="text-brand font-black text-sm">{formatPrice(vInfo.finalPrice)}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 bg-slate-100 dark:bg-black/40 px-3 py-1 rounded-xl">
                            <button onClick={() => updateQuantity(item.selectedVariantId!, 1)}><Plus size={14} /></button>
                            <span className="text-xs font-black">{toPersianDigits(item.quantity)}</span>
                            <button onClick={() => updateQuantity(item.selectedVariantId!, -1)}><Minus size={14} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.selectedVariantId!)} className="text-muted hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-8 pt-6 border-t border-muted/10">
              {!isProfileComplete && user?.isLoggedIn && (
                <div className="bg-yellow-500/5 p-4 rounded-2xl border border-yellow-500/10 flex items-center gap-3 mb-6">
                  <AlertCircle className="text-yellow-500 shrink-0" size={18} />
                  <p className="text-[9px] font-bold text-yellow-600">برای خرید نهایی، کد ملی و آدرس در پروفایل الزامی است.</p>
                </div>
              )}
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-black">مبلغ موقت</span>
                <div className="text-left">
                  <span className="text-2xl font-black text-brand">{formatPrice(totals.totalFinal)}</span>
                  <span className="text-[10px] mr-1 opacity-60 font-bold">تومان</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckoutClick}
                className="w-full bg-[#000038] dark:bg-brand text-white dark:text-primary py-5 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-3 transition-all"
              >
                <CreditCard size={22} /> تکمیل فرآیند خرید
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
