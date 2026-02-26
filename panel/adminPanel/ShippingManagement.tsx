
import React, { useState } from 'react';
import { 
  Truck, Plus, Trash2, Edit2, Check, X, 
  Zap, Package, MapPin, DollarSign, Clock, Info, ShieldCheck, AlertCircle, 
  ToggleLeft, ToggleRight, Settings, Lock, Key, Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShippingMethod } from '../../types';
import { toPersianDigits, formatPrice, toPersianDigitsGlobal } from '../../utils/helpers';

const ShippingManagement: React.FC = () => {
  // Destructured missing context methods from useApp
  const { shippingMethods, addShippingMethod, updateShippingMethod, deleteShippingMethod, addNotification } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ShippingMethod>>({
    name: '',
    cost: 0,
    estimatedTime: '',
    icon: 'Truck',
    isActive: true,
    description: '',
    apiEnabled: false,
    apiConfig: { endpoint: '', apiKey: '', provider: '' }
  });

  const handleSave = () => {
    if (!formData.name || !formData.estimatedTime) {
      addNotification('نام و زمان تخمینی الزامی است.', 'error');
      return;
    }

    if (editingId) {
      // Correctly using updateShippingMethod from context
      updateShippingMethod({ ...formData, id: editingId } as ShippingMethod);
    } else {
      // Correctly using addShippingMethod from context
      addShippingMethod({ ...formData, id: `SHP-${Date.now()}` } as ShippingMethod);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', cost: 0, estimatedTime: '', icon: 'Truck', isActive: true, description: '', apiEnabled: false, apiConfig: { endpoint: '', apiKey: '', provider: '' } });
  };

  const handleEdit = (m: ShippingMethod) => {
    setEditingId(m.id);
    setFormData(m);
    setIsAdding(true);
  };

  const toggleStatus = (m: ShippingMethod) => {
    // Correctly using updateShippingMethod from context
    updateShippingMethod({ ...m, isActive: !m.isActive });
  };

  return (
    <div className="space-y-10 animate-slide-in pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black">مدیریت لجستیک و ارسال</h2>
          <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">Shipping & Delivery Logistics</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-brand text-primary px-10 py-5 rounded-[24px] font-black text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
          >
            <Plus size={22} /> تعریف روش ارسال جدید
          </button>
        )}
      </header>

      {isAdding && (
        <div className="bg-white dark:bg-[#0a0a1a] p-10 rounded-[48px] border-2 border-brand/20 shadow-2xl space-y-10 animate-slide-up">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black flex items-center gap-4">
                 <Truck className="text-brand" size={32}/> {editingId ? 'ویرایش روش ارسال' : 'تعریف سرویس لجستیکی جدید'}
              </h3>
              <button onClick={resetForm} className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"><X size={28}/></button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest">عنوان سرویس (مثلا: پیک موتوری)</label>
                 <input 
                   value={formData.name} 
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-black text-sm border border-muted/5 focus:border-brand" 
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest">هزینه پایه ارسال (تومان)</label>
                 <input 
                   type="number"
                   value={formData.cost} 
                   onChange={e => setFormData({...formData, cost: Number(e.target.value)})}
                   className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-black text-sm border border-muted/5 focus:border-brand" 
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest">زمان تقریبی تحویل</label>
                 <input 
                   value={formData.estimatedTime} 
                   onChange={e => setFormData({...formData, estimatedTime: e.target.value})}
                   placeholder="مثلا: تا ۳ ساعت دیگر"
                   className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-black text-sm border border-muted/5 focus:border-brand" 
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest">آیکون نمایشی</label>
                 <select 
                    value={formData.icon}
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-muted/5"
                 >
                    <option value="Truck">کامیونت / وانت</option>
                    <option value="Zap">فوری (رعد)</option>
                    <option value="Package">بسته پستی</option>
                    <option value="MapPin">مکان‌محور</option>
                 </select>
              </div>

              <div className="md:col-span-2 space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest">توضیحات تکمیلی برای مشتری</label>
                 <input 
                   value={formData.description} 
                   onChange={e => setFormData({...formData, description: e.target.value})}
                   placeholder="محدوده پوشش‌دهی یا شرایط خاص..."
                   className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-muted/5 focus:border-brand" 
                 />
              </div>

              <div className="md:col-span-3 pt-6 border-t border-muted/5">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <Settings className="text-brand" size={20}/>
                       <h4 className="font-black text-sm uppercase tracking-widest">تنظیمات وب‌سرویس حمل و نقل (API)</h4>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, apiEnabled: !formData.apiEnabled})}
                      className="flex items-center gap-2"
                    >
                       <span className="text-[10px] font-black text-muted uppercase">فعالسازی انتخاب هوشمند هزینه:</span>
                       {formData.apiEnabled ? <ToggleRight className="text-brand" size={32}/> : <ToggleLeft className="text-muted" size={32}/>}
                    </button>
                 </div>

                 {formData.apiEnabled && (
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-down">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-muted uppercase flex items-center gap-2"><Package size={12}/> نام سرویس‌دهنده (Provider)</label>
                         <select 
                           value={formData.apiConfig?.provider} 
                           onChange={e => setFormData({...formData, apiConfig: {...formData.apiConfig, provider: e.target.value}})}
                           className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-xl outline-none font-bold text-xs border border-muted/10"
                         >
                            <option value="">انتخاب کنید...</option>
                            <option value="post_iran">پست ایران (NPI)</option>
                            <option value="tipax">تیپاکس (Tipax)</option>
                            <option value="alo_peyk">الوپیک / اسنپ‌باکس</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-muted uppercase flex items-center gap-2"><Key size={12}/> API Key / Client Secret</label>
                         <input 
                           type="password"
                           value={formData.apiConfig?.apiKey} 
                           onChange={e => setFormData({...formData, apiConfig: {...formData.apiConfig, apiKey: e.target.value}})}
                           className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-xl outline-none font-mono text-[10px] border border-muted/10" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-muted uppercase flex items-center gap-2"><Globe size={12}/> Tracking / Quote API Endpoint</label>
                         <input 
                           dir="ltr"
                           value={formData.apiConfig?.endpoint} 
                           onChange={e => setFormData({...formData, apiConfig: {...formData.apiConfig, endpoint: e.target.value}})}
                           className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-xl outline-none font-mono text-[10px] border border-muted/10" 
                         />
                      </div>
                   </div>
                 )}
              </div>
           </div>

           <div className="pt-8 border-t border-muted/5 flex justify-end gap-4">
              <button onClick={resetForm} className="px-10 py-5 rounded-[24px] font-black text-xs text-muted hover:bg-slate-100 dark:hover:bg-white/5">انصراف</button>
              <button 
                onClick={handleSave}
                className="bg-brand text-primary px-16 py-5 rounded-[24px] font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                 <Check size={20}/> {editingId ? 'بروزرسانی سرویس' : 'ثبت سرویس لجستیکی'}
              </button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shippingMethods.map(method => (
          <div key={method.id} className={`bg-white dark:bg-[#0a0a1a] p-8 rounded-[48px] border-2 transition-all group ${method.isActive ? 'border-muted/10 hover:border-brand/40 shadow-xl' : 'border-red-500/20 grayscale opacity-60'}`}>
            <div className="flex justify-between items-start mb-8">
               <div className={`p-5 rounded-3xl ${method.isActive ? 'bg-brand/10 text-brand' : 'bg-red-500/10 text-red-500'}`}>
                  {method.icon === 'Zap' ? <Zap size={32}/> : method.icon === 'Package' ? <Package size={32}/> : <Truck size={32}/>}
               </div>
               <div className="flex gap-2">
                  <button onClick={() => handleEdit(method)} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit2 size={18}/></button>
                  <button onClick={() => deleteShippingMethod(method.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black">{method.name}</h4>
                  <button onClick={() => toggleStatus(method)}>
                     {method.isActive ? <ToggleRight className="text-brand" size={32} /> : <ToggleLeft className="text-muted" size={32} />}
                  </button>
               </div>
               <div className="flex items-center gap-3 text-xs font-black text-muted">
                  <Clock size={16} className="text-brand" /> {toPersianDigitsGlobal(method.estimatedTime)}
               </div>
               <p className="text-[10px] text-muted font-bold leading-relaxed line-clamp-2">{method.description || 'توضیحاتی برای این روش ارسال ثبت نشده است.'}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-muted/5 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${method.apiEnabled ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                  <span className="text-[9px] font-black uppercase text-muted tracking-widest">{method.apiEnabled ? 'Live Sync' : 'Fixed Rate'}</span>
               </div>
               <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-brand">{method.cost === 0 ? 'رایگان' : formatPrice(method.cost)}</span>
                  {method.cost > 0 && <span className="text-[10px] font-bold opacity-40">تومان</span>}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingManagement;
