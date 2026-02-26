
import React, { useMemo } from 'react';
import { 
  Box, ShoppingCart, BarChart3, TrendingUp, Clock, DollarSign, Download, 
  Database, ShieldCheck, Zap, Plus, Ticket, Users, MessageSquare, ArrowUpRight, AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice, toPersianDigits } from '../../utils/helpers';

const Dashboard: React.FC = () => {
  const { products, orders, tickets, comments, allUsers, addNotification } = useApp();

  const stats = useMemo(() => ({
    revenueToday: orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).reduce((acc, o) => acc + o.totalAmount, 0),
    activeUsers: allUsers.length,
    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
    lowStock: products.filter(p => p.stock < 5).length
  }), [products, orders, allUsers]);

  return (
    <div className="space-y-12 animate-slide-in pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black">داشبورد فرماندهی</h2>
          <p className="text-xs text-muted font-bold mt-2 uppercase tracking-widest">Real-time Operations Ledger</p>
        </div>
        <div className="bg-white dark:bg-white/5 p-4 rounded-3xl flex items-center gap-8 shadow-xl">
           <div className="flex flex-col items-center"><span className="text-[10px] font-black text-muted uppercase">سرعت سرور</span><span className="text-sm font-black text-green-500">۴۲ms</span></div>
           <div className="h-8 w-px bg-muted/10" />
           <div className="flex flex-col items-center"><span className="text-[10px] font-black text-muted uppercase">وضعیت API</span><span className="text-sm font-black text-green-500">فعال</span></div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'فروش امروز', value: formatPrice(stats.revenueToday), icon: DollarSign, color: 'text-green-500' },
          { label: 'سفارشات در انتظار', value: toPersianDigits(stats.pendingOrders), icon: Clock, color: 'text-orange-500' },
          { label: 'کاربران فعال', value: toPersianDigits(stats.activeUsers), icon: Users, color: 'text-blue-500' },
          { label: 'کالای کم‌موجودی', value: toPersianDigits(stats.lowStock), icon: AlertTriangle, color: 'text-red-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#111122] p-8 rounded-[40px] shadow-xl border border-muted/5">
            <div className={`${s.color} bg-current/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}><s.icon size={24} /></div>
            <p className="text-[10px] font-black text-muted uppercase mb-2">{s.label}</p>
            <p className="text-2xl font-black">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white dark:bg-[#111122] p-10 rounded-[48px] border border-muted/10 shadow-lg">
            <h3 className="text-xl font-black mb-8 flex items-center gap-4"><Zap size={24} className="text-brand" /> عملیات سریع (Quick Actions)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: 'افزودن کالا', icon: Plus, color: 'bg-brand' },
                 { label: 'کد تخفیف', icon: Ticket, color: 'bg-blue-500' },
                 { label: 'تیکت‌ها', icon: MessageSquare, color: 'bg-purple-500' },
                 { label: 'گزارش مالی', icon: BarChart3, color: 'bg-green-500' },
               ].map((action, i) => (
                 <button key={i} className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-white/5 rounded-3xl hover:scale-105 transition-all group">
                    <div className={`${action.color} text-white p-4 rounded-2xl mb-4 group-hover:shadow-lg transition-all`}><action.icon size={22}/></div>
                    <span className="text-[11px] font-black">{action.label}</span>
                 </button>
               ))}
            </div>
         </div>
         <div className="bg-[#000038] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><TrendingUp size={120}/></div>
            <h3 className="text-xl font-black mb-6">تحلیل هوشمند بازار</h3>
            <p className="text-sm font-medium opacity-60 leading-relaxed">بر اساس داده‌های هفته اخیر، تقاضا برای "لوازم جانبی آیفون ۱۵" ۱۸٪ افزایش یافته است. پیشنهاد می‌شود کمپین تخفیفی در این دسته فعال کنید.</p>
            <button className="mt-8 flex items-center gap-2 text-brand font-black text-xs uppercase tracking-widest">مشاهده کامل <ArrowUpRight size={16}/></button>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
