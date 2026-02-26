
import React, { useState } from 'react';
import { 
  WalletCards, Plus, Trash2, Edit2, Check, X, 
  CreditCard, Wallet, Banknote, ShieldCheck, ToggleLeft, ToggleRight, 
  Lock, Globe, Key, Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';

const PaymentManagement: React.FC = () => {
  // Destructured missing context methods from useApp
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, addNotification } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    name: '',
    description: '',
    icon: 'CreditCard',
    isActive: true,
    type: 'ONLINE',
    apiEnabled: false,
    apiConfig: { endpoint: '', apiKey: '', merchantId: '' }
  });

  const handleSave = () => {
    if (!formData.name) {
      addNotification('نام روش پرداخت الزامی است.', 'error');
      return;
    }

    if (editingId) {
      // Correctly using updatePaymentMethod from context
      updatePaymentMethod({ ...formData, id: editingId } as PaymentMethod);
    } else {
      // Correctly using addPaymentMethod from context
      addPaymentMethod({ ...formData, id: `PAY-${Date.now()}` } as PaymentMethod);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', description: '', icon: 'CreditCard', isActive: true, type: 'ONLINE', apiEnabled: false, apiConfig: { endpoint: '', apiKey: '', merchantId: '' } });
  };

  const handleEdit = (p: PaymentMethod) => {
    setEditingId(p.id);
    setFormData(p);
    setIsAdding(true);
  };

  const toggleStatus = (p: PaymentMethod) => {
    // Correctly using updatePaymentMethod from context
    updatePaymentMethod({ ...p, isActive: !p.isActive });
  };

  return (
    <div className="space-y-10 animate-slide-in pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black">مدیریت روش‌های پرداخت</h2>
          <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">Payment Gateways & Finance</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-brand text-primary px-10 py-5 rounded-[24px] font-black text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
          >
            <Plus size={22} /> افزودن درگاه یا روش جدید
          </button>
        )}
      </header>

      {isAdding && (
        <div className="bg-white dark:bg-[#0a0a1a] p-10 rounded-[48px] border-2 border-brand/20 shadow-2xl space-y-10 animate-slide-up">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black flex items-center gap-4">
                 <WalletCards className="text-brand" size={32}/> {editingId ? 'ویرایش تنظیمات پرداخت' : 'تعریف روش پرداخت جدید'}
              </h3>
              <button onClick={resetForm} className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"><X size={28}/></button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest">عنوان نمایشی (مثلا: درگاه سامان)</label>
                 <input 
                   value={formData.name} 
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-black text-sm border border-muted/5 focus:border-brand" 
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest">نوع تراکنش</label>
                 <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-muted/5"
                 >
                    <option value="ONLINE">درگاه آنلاین (بانکی)</option>
                    <option value="OFFLINE">آفلاین (کارت به کارت)</option>
                    <option value="WALLET">کیف پول داخلی</option>
                 </select>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest">آیکون</label>
                 <select 
                    value={formData.icon}
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-muted/5"
                 >
                    <option value="CreditCard">کارت بانکی</option>
                    <option value="Wallet">کیف پول</option>
                    <option value="Banknote">اسکناس / چک</option>
                 </select>
              </div>

              <div className="md:col-span-3 space-y-3">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest">توضیحات کوتاه برای کاربر</label>
                 <input 
                   value={formData.description} 
                   onChange={e => setFormData({...formData, description: e.target.value})}
                   className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-muted/5" 
                 />
              </div>

              <div className="md:col-span-3 pt-6 border-t border-muted/5">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <Settings className="text-brand" size={20}/>
                       <h4 className="font-black text-sm uppercase tracking-widest">تنظیمات اتصال API (پیشرفته)</h4>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, apiEnabled: !formData.apiEnabled})}
                      className="flex items-center gap-2"
                    >
                       <span className="text-[10px] font-black text-muted uppercase">فعالسازی اتصال مستقیم:</span>
                       {formData.apiEnabled ? <ToggleRight className="text-brand" size={32}/> : <ToggleLeft className="text-muted" size={32}/>}
                    </button>
                 </div>

                 {formData.apiEnabled && (
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-down">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-muted uppercase flex items-center gap-2"><Lock size={12}/> Merchant ID</label>
                         <input 
                           value={formData.apiConfig?.merchantId} 
                           onChange={e => setFormData({...formData, apiConfig: {...formData.apiConfig, merchantId: e.target.value}})}
                           className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-xl outline-none font-mono text-[10px] border border-muted/10" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-muted uppercase flex items-center gap-2"><Key size={12}/> API Key / Token</label>
                         <input 
                           type="password"
                           value={formData.apiConfig?.apiKey} 
                           onChange={e => setFormData({...formData, apiConfig: {...formData.apiConfig, apiKey: e.target.value}})}
                           className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-xl outline-none font-mono text-[10px] border border-muted/10" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-muted uppercase flex items-center gap-2"><Globe size={12}/> Callback / Endpoint URL</label>
                         <input 
                           dir="ltr"
                           value={formData.apiConfig?.endpoint} 
                           onChange={e => setFormData({...formData, apiConfig: {...formData.apiConfig, endpoint: e.target.value}})}
                           placeholder="https://api.gateway.com/..."
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
                 <Check size={20}/> {editingId ? 'بروزرسانی روش پرداخت' : 'ثبت متد پرداخت'}
              </button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paymentMethods.map(method => (
          <div key={method.id} className={`bg-white dark:bg-[#0a0a1a] p-8 rounded-[48px] border-2 transition-all group ${method.isActive ? 'border-muted/10 hover:border-brand/40 shadow-xl' : 'border-red-500/20 grayscale opacity-60'}`}>
            <div className="flex justify-between items-start mb-8">
               <div className={`p-5 rounded-3xl ${method.isActive ? 'bg-brand/10 text-brand' : 'bg-red-500/10 text-red-500'}`}>
                  {method.icon === 'Wallet' ? <Wallet size={32}/> : method.icon === 'Banknote' ? <Banknote size={32}/> : <CreditCard size={32}/>}
               </div>
               <div className="flex gap-2">
                  <button onClick={() => handleEdit(method)} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit2 size={18}/></button>
                  <button onClick={() => deletePaymentMethod(method.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black">{method.name}</h4>
                  <button onClick={() => toggleStatus(method)}>
                     {method.isActive ? <ToggleRight className="text-brand" size={32} /> : <ToggleLeft className="text-muted" size={32} />}
                  </button>
               </div>
               <p className="text-[10px] text-muted font-bold leading-relaxed line-clamp-2">{method.description || 'توضیحاتی ثبت نشده است.'}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-muted/5 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${method.apiEnabled ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <span className="text-[9px] font-black uppercase text-muted tracking-widest">{method.apiEnabled ? 'API Linked' : 'Manual Entry'}</span>
               </div>
               <span className="text-[9px] font-black bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full uppercase">{method.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentManagement;
