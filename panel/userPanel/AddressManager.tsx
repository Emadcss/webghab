
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Plus, Trash2, Home, Smartphone, User, CheckCircle2 } from 'lucide-react';
import { PROVINCES, CITIES } from '../../data/iran-cities';
import { toPersianDigitsGlobal } from '../../utils/helpers';
import { Address } from '../../types';

const AddressManager: React.FC = () => {
  const { user, addAddress, deleteAddress } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Address>>({
    title: '', receiverName: '', phone: '', province: 'تهران', city: 'تهران', fullAddress: '', postalCode: '', isDefault: false
  });

  const currentProvinceId = useMemo(() => PROVINCES.find(p => p.name === formData.province)?.id, [formData.province]);
  const filteredCities = useMemo(() => CITIES.filter(c => c.province_id === currentProvinceId), [currentProvinceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAddress(formData as Address);
    setShowAddModal(false);
    setFormData({ title: '', receiverName: '', phone: '', province: 'تهران', city: 'تهران', fullAddress: '', postalCode: '', isDefault: false });
  };

  return (
    <div className="animate-slide-up space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black flex items-center gap-4"><MapPin className="text-brand" /> مدیریت نشانی‌ها</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand text-primary px-6 py-3 rounded-xl font-black text-[10px] flex items-center gap-2 shadow-lg"
        >
          <Plus size={16} /> افزودن نشانی جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user?.addresses.map(addr => (
          <div key={addr.id} className="p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-muted/10 relative group">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-black text-sm flex items-center gap-2">
                <Home size={16} className="text-brand" /> {addr.title}
              </h4>
              <button onClick={() => deleteAddress(addr.id)} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed mb-6">
              {addr.province}، {addr.city}، {addr.fullAddress}
            </p>
            <div className="flex items-center justify-between text-[9px] font-black opacity-60 border-t border-muted/5 pt-4">
               <span className="flex items-center gap-2"><Smartphone size={14}/> {toPersianDigitsGlobal(addr.phone)}</span>
               <span className="flex items-center gap-2"><User size={14}/> {addr.receiverName}</span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <form onSubmit={handleSubmit} className="relative w-full max-w-xl bg-white dark:bg-[#0a0a20] rounded-[40px] p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-black mb-4">ثبت نشانی جدید</h3>
            <div className="grid grid-cols-2 gap-4">
               <input placeholder="عنوان (مثلا منزل)" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="col-span-2 p-4 rounded-2xl bg-slate-100 dark:bg-white/5 outline-none font-bold text-xs" required />
               <input placeholder="نام گیرنده" value={formData.receiverName} onChange={e=>setFormData({...formData, receiverName: e.target.value})} className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 outline-none font-bold text-xs" required />
               <input placeholder="شماره تماس" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 outline-none font-bold text-xs text-left" dir="ltr" required />
               <select value={formData.province} onChange={e=>setFormData({...formData, province: e.target.value})} className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 outline-none font-bold text-xs">
                 {PROVINCES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
               </select>
               <select value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 outline-none font-bold text-xs">
                 {filteredCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
               </select>
               <textarea placeholder="نشانی دقیق پستی" value={formData.fullAddress} onChange={e=>setFormData({...formData, fullAddress: e.target.value})} className="col-span-2 p-4 rounded-2xl bg-slate-100 dark:bg-white/5 outline-none font-bold text-xs h-24" required />
            </div>
            <button type="submit" className="w-full bg-brand text-primary py-5 rounded-2xl font-black shadow-xl">ذخیره نشانی</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddressManager;
