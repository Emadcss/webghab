
import React, { useState } from 'react';
import { ShoppingBag, Search, Eye, RefreshCw, CheckCircle, Clock, XCircle, Truck, DollarSign, CreditCard, Hash } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice, toPersianDigits, toPersianDigitsGlobal } from '../../utils/helpers';
import { OrderStatus, Order, PaymentStatus } from '../../types';

const OrderManagement: React.FC = () => {
  const { orders, updateOrder } = useApp();
  const [q, setQ] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusMap: any = {
    [OrderStatus.PENDING]: { label: 'در انتظار', color: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
    [OrderStatus.PROCESSING]: { label: 'در حال پردازش', color: 'bg-blue-500/10 text-blue-500', icon: RefreshCw },
    [OrderStatus.SHIPPED]: { label: 'ارسال شده', color: 'bg-purple-500/10 text-purple-500', icon: Truck },
    [OrderStatus.DELIVERED]: { label: 'تحویل شده', color: 'bg-green-500/10 text-green-500', icon: CheckCircle },
    [OrderStatus.CANCELLED]: { label: 'لغو شده', color: 'bg-red-500/10 text-red-500', icon: XCircle },
  };

  const paymentMap: any = {
    [PaymentStatus.PAID]: { label: 'پرداخت شده', color: 'text-green-500' },
    [PaymentStatus.UNPAID]: { label: 'پرداخت نشده', color: 'text-red-500' },
    [PaymentStatus.REFUNDED]: { label: 'مرجوع شده', color: 'text-blue-500' },
  };

  const filtered = orders.filter(o => o.userName.includes(q) || o.id.includes(q));

  return (
    <div className="space-y-8 animate-slide-in">
       <header className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black">سفارشات و مدیریت مالی</h2>
            <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">Enterprise Order Ledger</p>
          </div>
          <div className="relative w-80">
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
             <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="جستجوی با شناسه یا مشتری..." className="w-full bg-white dark:bg-[#000028] p-4 pr-12 rounded-2xl outline-none font-bold border border-muted/10" />
          </div>
       </header>

       <div className="bg-white dark:bg-[#000028] rounded-[40px] shadow-xl overflow-hidden border border-muted/10">
          <table className="w-full text-right">
             <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black text-muted uppercase tracking-widest">
                <tr><th className="p-8">شناسه تراکنش</th><th className="p-8">مشتری</th><th className="p-8">مبلغ کل</th><th className="p-8">وضعیت مالی</th><th className="p-8">وضعیت عملیاتی</th><th className="p-8 text-center">عملیات</th></tr>
             </thead>
             <tbody className="divide-y divide-muted/10">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                     <td className="p-8 font-black text-xs">
                        <div className="flex items-center gap-2">
                           <Hash size={14} className="text-brand opacity-40"/>
                           <span className="text-brand">{toPersianDigitsGlobal(o.id)}</span>
                        </div>
                     </td>
                     <td className="p-8">
                        <p className="font-bold text-xs">{o.userName}</p>
                        <p className="text-[8px] text-muted-foreground mt-1">ID: {toPersianDigitsGlobal(o.userId)}</p>
                     </td>
                     <td className="p-8 font-black text-xs">{formatPrice(o.totalAmount)}</td>
                     <td className="p-8">
                        <span className={`text-[9px] font-black flex items-center gap-2 ${paymentMap[o.paymentStatus || PaymentStatus.UNPAID].color}`}>
                           <DollarSign size={12} />
                           {paymentMap[o.paymentStatus || PaymentStatus.UNPAID].label}
                        </span>
                     </td>
                     <td className="p-8">
                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black flex items-center gap-2 w-fit ${statusMap[o.status].color}`}>
                           {React.createElement(statusMap[o.status].icon, { size: 12 })}
                           {statusMap[o.status].label}
                        </span>
                     </td>
                     <td className="p-8 flex justify-center gap-3">
                        <button onClick={() => setSelectedOrder(o)} className="p-2.5 bg-brand/10 text-brand rounded-xl hover:bg-brand hover:text-primary transition-all shadow-md"><Eye size={18} /></button>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
          {filtered.length === 0 && (
             <div className="p-20 text-center opacity-30 flex flex-col items-center gap-4">
                <ShoppingBag size={64}/>
                <p className="font-black italic">هیچ سفارشی در سیستم یافت نشد.</p>
             </div>
          )}
       </div>

       {selectedOrder && (
         <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#000038] rounded-[40px] shadow-2xl overflow-hidden p-10 animate-slide-in border border-white/10">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Hash size={24} className="text-brand"/> مدیریت سفارش {toPersianDigitsGlobal(selectedOrder.id)}</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl space-y-3 border border-muted/5">
                     <span className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><CreditCard size={14}/> وضعیت تراکنش مالی</span>
                     <select 
                       value={selectedOrder.paymentStatus || PaymentStatus.UNPAID} 
                       onChange={(e) => {
                         updateOrder({ ...selectedOrder, paymentStatus: e.target.value as PaymentStatus });
                         setSelectedOrder(prev => prev ? {...prev, paymentStatus: e.target.value as PaymentStatus} : null);
                       }}
                       className="w-full bg-white dark:bg-black p-4 rounded-xl text-xs font-bold outline-none border border-muted/10 focus:border-brand"
                     >
                       {Object.entries(PaymentStatus).map(([k,v]) => <option key={k} value={v}>{paymentMap[v].label}</option>)}
                     </select>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl space-y-3 border border-muted/5">
                     <span className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><Truck size={14}/> وضعیت لجستیک</span>
                     <select 
                       value={selectedOrder.status} 
                       onChange={(e) => {
                         updateOrder({ ...selectedOrder, status: e.target.value as OrderStatus });
                         setSelectedOrder(prev => prev ? {...prev, status: e.target.value as OrderStatus} : null);
                       }}
                       className="w-full bg-white dark:bg-black p-4 rounded-xl text-xs font-bold outline-none border border-muted/10 focus:border-brand"
                     >
                       {Object.entries(OrderStatus).map(([k,v]) => <option key={k} value={v}>{statusMap[v].label}</option>)}
                     </select>
                  </div>
               </div>
               
               <div className="space-y-4 mb-10">
                  <h4 className="text-[10px] font-black uppercase text-muted tracking-widest">اقلام فاکتور</h4>
                  <div className="space-y-2">
                     {selectedOrder.items.map((item, idx) => (
                       <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-muted/5">
                          <span className="text-xs font-bold">{toPersianDigitsGlobal(item.productName)}</span>
                          <span className="text-xs font-black text-brand">{toPersianDigits(item.quantity)} عدد</span>
                       </div>
                     ))}
                  </div>
               </div>

               <button onClick={() => setSelectedOrder(null)} className="w-full bg-brand text-primary py-5 rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all">ذخیره تغییرات و خروج</button>
            </div>
         </div>
       )}
    </div>
  );
};

export default OrderManagement;
