
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, User, Phone, Mail, Hash } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { user, updateUserProfile } = useApp();
  const [formData, setFormData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    phone: user?.phone || '',
    nationalId: user?.nationalId || ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      nationalId: formData.nationalId
    });
  };

  return (
    <div className="animate-slide-up space-y-10">
       <h2 className="text-2xl font-black flex items-center gap-4"><User className="text-brand" /> اطلاعات شناسایی</h2>
       <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
             <label className="text-[10px] font-black text-muted uppercase">نام</label>
             <input value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/40 outline-none border border-muted/10 font-bold text-sm" />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-muted uppercase">نام خانوادگی</label>
             <input value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/40 outline-none border border-muted/10 font-bold text-sm" />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-muted uppercase">شماره همراه</label>
             <input value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} dir="ltr" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/40 outline-none border border-muted/10 font-bold text-sm text-left" />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-muted uppercase">کد ملی</label>
             <input value={formData.nationalId} onChange={e=>setFormData({...formData, nationalId: e.target.value})} dir="ltr" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/40 outline-none border border-muted/10 font-bold text-sm text-left" />
          </div>
          <button type="submit" className="md:col-span-2 bg-brand text-primary py-5 rounded-2xl font-black shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
             <Save size={20}/> ذخیره تغییرات پروفایل
          </button>
       </form>
    </div>
  );
};

export default ProfileSettings;
