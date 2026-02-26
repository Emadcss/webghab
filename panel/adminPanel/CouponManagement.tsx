
import React, { useState } from 'react';
import { 
  Ticket, Plus, Search, Trash2, Edit2, Check, X, RefreshCw, 
  Calendar, Percent, DollarSign, Info, ShieldCheck, AlertCircle, Hash
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Coupon, DiscountType } from '../../types';
import { toPersianDigits, formatPrice, toPersianDigitsGlobal } from '../../utils/helpers';

const CouponManagement: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, addNotification } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    discountType: DiscountType.PERCENTAGE,
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0, // Property added to Coupon type in types.ts
    status: 'ACTIVE',
    usedCount: 0
  });

  const filtered = coupons.filter(c => c.code.toLowerCase().includes(q.toLowerCase()));

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'WG-';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData({ ...formData, code });
  };

  const handleSave = () => {
    if (!formData.code || !formData.discountValue) {
      addNotification('کد و مقدار تخفیف الزامی است.', 'error');
      return;
    }

    if (editingId) {
      updateCoupon({ ...formData, id: editingId } as Coupon);
      addNotification('کوپن بروزرسانی شد.', 'success');
    } else {
      addCoupon({ ...formData, id: `CPN-${Date.now()}`, usedCount: 0 } as Coupon);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ code: '', discountType: DiscountType.PERCENTAGE, discountValue: 0, minOrderAmount: 0, maxDiscountAmount: 0, status: 'ACTIVE' });
  };

  const handleEdit = (c: Coupon) => {
    setEditingId(c.id);
    setFormData(c);
    setIsAdding(true);
  };

  return (
    <div className="space-y-10 animate-slide-in pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black">مدیریت کدهای تخفیف</h2>
          <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">Promotion & Voucher Engine</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-brand text-primary px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
          >
            <Plus size={20} /> تعریف کوپن جدید
          </button>
        )}
      </header>

      {isAdding && (
        <div className="bg-white dark:bg-[#0a0a1a] p-10 rounded-[48px] border-2 border-brand/20 shadow-2xl space-y-10 animate-slide-up">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black flex items-center gap-4"><Ticket className="text-brand" size={32}/> {editingId ? 'ویرایش کوپن' : 'تعریف کوپن اختصاصی'}</h3>
              <button onClick={resetForm} className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"><X size={28}/></button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">کد تخفیف (Voucher Code)</label>
                 <div className="flex gap-2">
                    <input 
                      value={formData.code} 
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="flex-1 bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-black text-sm border border-muted/5 focus:border-brand text-center" 
                      placeholder="WG-SPECIAL"
                    />
                    <button onClick={generateRandomCode} className="p-5 bg-primary dark:bg-white/5 text-brand rounded-2xl hover:bg-brand hover:text-primary transition-all shadow-lg"><RefreshCw size={20}/></button>
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">نوع تخفیف</label>
                 <select 
                    value={formData.discountType}
                    onChange={e => setFormData({...formData, discountType: e.target.value as DiscountType})}
                    className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-muted/5 focus:border-brand"
                 >
                    <option value={DiscountType.PERCENTAGE}>درصدی (٪)</option>
                    <option value={DiscountType.FIXED}>مبلغ ثابت (تومان)</option>
                 </select>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">مقدار {formData.discountType === DiscountType.PERCENTAGE ? 'درصد' : 'مبلغ'}</label>
                 <input 
                   type="number"
                   value={formData.discountValue} 
                   onChange={e => setFormData({...formData, discountValue: Number(e.target.value)})}
                   className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-black text-sm border border-muted/5 focus:border-brand" 
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">حداقل مبلغ خرید (تومان)</label>
                 <input 
                   type="number"
                   value={formData.minOrderAmount} 
                   onChange={e => setFormData({...formData, minOrderAmount: Number(e.target.value)})}
                   className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-muted/5" 
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">سقف تخفیف (برای درصدی)</label>
                 <input 
                   type="number"
                   value={formData.maxDiscountAmount} 
                   onChange={e => setFormData({...formData, maxDiscountAmount: Number(e.target.value)})}
                   className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-muted/5" 
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">وضعیت فعالسازی</label>
                 <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-muted/5"
                 >
                    <option value="ACTIVE">فعال و آماده استفاده</option>
                    <option value="DISABLED">غیرفعال (موقت)</option>
                    <option value="EXPIRED">منقضی شده</option>
                 </select>
              </div>
           </div>

           <div className="pt-8 border-t border-muted/5 flex justify-end gap-4">
              <button onClick={resetForm} className="px-10 py-5 rounded-[24px] font-black text-xs text-muted hover:bg-slate-100 dark:hover:bg-white/5">انصراف</button>
              <button 
                onClick={handleSave}
                className="bg-brand text-primary px-16 py-5 rounded-[24px] font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                 <Check size={20}/> ثبت نهایی کد تخفیف
              </button>
           </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#0a0a1a] rounded-[40px] shadow-xl overflow-hidden border border-muted/10">
         <div className="p-8 border-b border-muted/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <h4 className="text-xl font-black flex items-center gap-3"><ShieldCheck className="text-green-500" size={24}/> لیست کدهای فعال سیستم</h4>
            <div className="relative w-80">
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
               <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="جستجوی کد..." className="w-full bg-slate-50 dark:bg-black/20 p-4 pr-12 rounded-2xl outline-none font-bold text-xs border border-muted/5" />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-right">
               <thead className="bg-slate-50 dark:bg-white/5 text-[9px] font-black text-muted uppercase tracking-[2px]">
                  <tr>
                    <th className="p-6">کد تخفیف</th>
                    <th className="p-6">مقدار</th>
                    <th className="p-6">شرایط</th>
                    <th className="p-6">تعداد استفاده</th>
                    <th className="p-6">وضعیت</th>
                    <th className="p-6 text-center">عملیات</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-muted/10">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                       <td className="p-6">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-brand/10 text-brand rounded-lg"><Hash size={16}/></div>
                             <span className="font-black text-sm tracking-widest">{c.code}</span>
                          </div>
                       </td>
                       <td className="p-6">
                          <span className="font-black text-xs">
                             {c.discountType === DiscountType.PERCENTAGE ? `${toPersianDigits(c.discountValue)}٪` : `${formatPrice(c.discountValue)} ت`}
                          </span>
                       </td>
                       <td className="p-6">
                          <p className="text-[9px] font-bold text-muted-foreground">حداقل: {formatPrice(c.minOrderAmount)} ت</p>
                          {c.maxDiscountAmount && <p className="text-[9px] font-bold text-brand mt-1">سقف: {formatPrice(c.maxDiscountAmount)} ت</p>}
                       </td>
                       <td className="p-6">
                          <span className="text-[10px] font-black text-primary dark:text-white bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">{toPersianDigits(c.usedCount)} استفاده</span>
                       </td>
                       <td className="p-6">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black ${c.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                             {c.status === 'ACTIVE' ? 'فعال' : c.status === 'DISABLED' ? 'غیرفعال' : 'منقضی'}
                          </span>
                       </td>
                       <td className="p-6 flex justify-center gap-3">
                          <button onClick={() => handleEdit(c)} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit2 size={18}/></button>
                          <button onClick={() => deleteCoupon(c.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
            {filtered.length === 0 && (
               <div className="py-20 text-center opacity-30">
                  <AlertCircle size={64} className="mx-auto mb-4" />
                  <p className="font-black italic">هیچ کوپنی یافت نشد.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default CouponManagement;
