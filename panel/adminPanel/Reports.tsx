
import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, PieChart, Activity, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice, toPersianDigits } from '../../utils/helpers';

const Reports: React.FC = () => {
  const { products, orders } = useApp();

  const totalSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const lowStockProducts = products.filter(p => p.stock < 5);

  return (
    <div className="space-y-12 animate-slide-in">
       <h2 className="text-3xl font-black">گزارشات و آمار فروش</h2>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'کل فروش ۳۰ روزه', value: formatPrice(totalSales), icon: TrendingUp, color: 'text-green-500' },
            { label: 'سفارشات موفق', value: toPersianDigits(orders.length), icon: Activity, color: 'text-blue-500' },
            { label: 'کالاهای کم‌موجودی', value: toPersianDigits(lowStockProducts.length), icon: AlertTriangle, color: 'text-red-500' },
            { label: 'رشد ماهانه', value: toPersianDigits('۱۲٪+'), icon: BarChart3, color: 'text-brand' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-[#000028] p-8 rounded-[36px] border border-muted/10 shadow-lg">
               <div className={`${s.color} bg-current/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4`}><s.icon size={24} /></div>
               <p className="text-[10px] font-black text-muted uppercase mb-1">{s.label}</p>
               <p className="text-xl font-black">{s.value}</p>
            </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#000028] p-10 rounded-[48px] border border-muted/10">
             <h3 className="text-lg font-black mb-6 flex items-center gap-3"><PieChart size={20} className="text-brand"/> سهم فروش دسته‌ها</h3>
             <div className="space-y-4">
                {['گوشی موبایل', 'لوازم جانبی', 'ساعت هوشمند'].map((cat, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black"><span>{cat}</span><span>{toPersianDigits(60 - i*15)}٪</span></div>
                     <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand rounded-full" style={{ width: `${60 - i*15}%` }} />
                     </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-white dark:bg-[#000028] p-10 rounded-[48px] border border-muted/10">
             <h3 className="text-lg font-black mb-6 flex items-center gap-3"><AlertTriangle size={20} className="text-red-500"/> هشدارهای انبار</h3>
             <div className="space-y-3">
                {lowStockProducts.slice(0, 4).map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                     <span className="text-[10px] font-black">{p.name}</span>
                     <span className="text-[10px] font-black text-red-500">موجودی: {toPersianDigits(p.stock)}</span>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default Reports;
