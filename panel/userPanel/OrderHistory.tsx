
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Clock, CheckCircle2, AlertCircle, Hash, ChevronLeft } from 'lucide-react';
import { formatPrice, toPersianDigits, toPersianDigitsGlobal } from '../../utils/helpers';

const OrderHistory: React.FC = () => {
  const { orders } = useApp();

  return (
    <div className="animate-slide-up space-y-8">
      <h2 className="text-2xl font-black flex items-center gap-4"><Package className="text-brand" /> تاریخچه سفارشات</h2>
      
      <div className="space-y-4">
        {orders.length > 0 ? orders.map(order => (
          <div key={order.id} className="p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-muted/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
                <Hash size={24} />
              </div>
              <div>
                <p className="text-xs font-black">کد سفارش: {toPersianDigitsGlobal(order.id)}</p>
                <p className="text-[10px] text-muted font-bold mt-1">ثبت شده در {toPersianDigitsGlobal(new Date(order.createdAt).toLocaleDateString('fa-IR'))}</p>
              </div>
            </div>

            <div className="flex items-center gap-10">
               <div className="text-center md:text-left">
                  <p className="text-[10px] font-black text-muted uppercase mb-1">مبلغ کل</p>
                  <p className="text-sm font-black text-brand">{formatPrice(order.totalAmount)} تومان</p>
               </div>
               <div className={`px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 ${order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                  {order.status === 'PENDING' ? <Clock size={14}/> : <CheckCircle2 size={14}/>}
                  {order.status === 'PENDING' ? 'در انتظار تایید' : 'تحویل شده'}
               </div>
               <button className="p-3 bg-white dark:bg-white/5 rounded-xl border border-muted/5 hover:bg-brand transition-all group">
                  <ChevronLeft size={18} className="group-hover:text-primary" />
               </button>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
             <Package size={64} strokeWidth={1} />
             <p className="font-black italic text-lg">هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
