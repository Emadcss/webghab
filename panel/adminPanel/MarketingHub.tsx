
import React, { useState } from 'react';
import { 
  Zap, Megaphone, Monitor, Layout, Save, Plus, Trash2, 
  MessageSquare, Hash, Share2, Bell, Target, TrendingUp, Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppearanceSettings, MarketingCampaign } from '../../types';
import { toPersianDigits } from '../../utils/helpers';

const MarketingHub: React.FC = () => {
  const { appearance, updateAppearance, addNotification } = useApp();
  const [settings, setSettings] = useState<AppearanceSettings>(appearance);

  const handleSave = async () => {
    await updateAppearance(settings);
    addNotification('کمپین‌های مارکتینگ با موفقیت بروزرسانی شدند.', 'success');
  };

  const addPopup = () => {
    const newPopup: MarketingCampaign = {
      id: `mkt-${Date.now()}`,
      type: 'POPUP',
      title: 'عنوان کمپین جدید',
      content: 'متن پاپ‌آپ تبلیغاتی...',
      link: '#',
      isActive: true
    };
    setSettings({
      ...settings,
      marketing: {
        ...settings.marketing,
        activePopups: [...settings.marketing.activePopups, newPopup]
      }
    });
  };

  return (
    <div className="space-y-10 animate-slide-in pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black">مرکز بازاریابی و افزایش فروش</h2>
          <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">Conversion & Marketing Hub</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-brand text-primary px-12 py-5 rounded-[24px] font-black text-sm flex items-center gap-3 shadow-2xl hover:scale-105 transition-all"
        >
          <Save size={20} /> انتشار کمپین‌های زنده
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'اعلان‌های Social Proof', value: settings.marketing.showSocialProof ? 'فعال' : 'غیرفعال', icon: Users, color: 'text-blue-500' },
           { label: 'پاپ‌آپ‌های فعال', value: toPersianDigits(settings.marketing.activePopups.length), icon: Bell, color: 'text-brand' },
           { label: 'هدف‌گذاری کمپین', value: 'High Intent', icon: Target, color: 'text-green-500' },
         ].map((s, i) => (
           <div key={i} className="bg-white dark:bg-[#111122] p-8 rounded-[40px] border border-muted/10 shadow-xl">
              <div className={`${s.color} bg-current/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6`}><s.icon size={24} /></div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[2px] mb-2">{s.label}</p>
              <p className="text-xl font-black">{s.value}</p>
           </div>
         ))}
      </div>

      <div className="bg-white dark:bg-[#0a0a1a] rounded-[48px] border border-muted/10 shadow-2xl p-10 space-y-10">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-black flex items-center gap-4"><Megaphone className="text-brand" size={24}/> مدیریت پاپ‌آپ‌های تبلیغاتی</h3>
            <button onClick={addPopup} className="p-3 bg-brand/10 text-brand rounded-2xl hover:bg-brand hover:text-primary transition-all"><Plus size={24}/></button>
         </div>

         <div className="grid grid-cols-1 gap-8">
            {settings.marketing.activePopups.map((popup) => (
              <div key={popup.id} className="p-8 bg-slate-50 dark:bg-white/5 rounded-[40px] border border-muted/10 relative group">
                <div className="flex flex-col md:flex-row gap-10">
                   <div className="flex-1 space-y-6">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-muted uppercase tracking-widest">عنوان پاپ‌آپ</label>
                         <input 
                           value={popup.title} 
                           onChange={e => {
                             const newList = settings.marketing.activePopups.map(p => p.id === popup.id ? {...p, title: e.target.value} : p);
                             setSettings({...settings, marketing: {...settings.marketing, activePopups: newList}});
                           }}
                           className="w-full bg-white dark:bg-black p-4 rounded-xl text-xs font-black border border-muted/10" 
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-muted uppercase tracking-widest">محتوای اصلی</label>
                         <textarea 
                           value={popup.content} 
                           onChange={e => {
                             const newList = settings.marketing.activePopups.map(p => p.id === popup.id ? {...p, content: e.target.value} : p);
                             setSettings({...settings, marketing: {...settings.marketing, activePopups: newList}});
                           }}
                           className="w-full bg-white dark:bg-black p-4 rounded-xl text-xs font-bold border border-muted/10 h-24" 
                         />
                      </div>
                   </div>
                   <div className="w-full md:w-80 space-y-6">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-muted uppercase tracking-widest">لینک دکمه (Action)</label>
                         <input 
                           value={popup.link} 
                           onChange={e => {
                             const newList = settings.marketing.activePopups.map(p => p.id === popup.id ? {...p, link: e.target.value} : p);
                             setSettings({...settings, marketing: {...settings.marketing, activePopups: newList}});
                           }}
                           className="w-full bg-white dark:bg-black p-4 rounded-xl text-xs font-bold border border-muted/10" 
                         />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-black rounded-2xl border border-muted/10">
                         <span className="text-[10px] font-black uppercase">وضعیت نمایش</span>
                         <button 
                            onClick={() => {
                              const newList = settings.marketing.activePopups.map(p => p.id === popup.id ? {...p, isActive: !p.isActive} : p);
                              setSettings({...settings, marketing: {...settings.marketing, activePopups: newList}});
                            }}
                            className={`w-12 h-6 rounded-full transition-all relative ${popup.isActive ? 'bg-brand' : 'bg-muted/20'}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${popup.isActive ? 'right-7' : 'right-1'}`} />
                         </button>
                      </div>
                      <button 
                         onClick={() => {
                           const newList = settings.marketing.activePopups.filter(p => p.id !== popup.id);
                           setSettings({...settings, marketing: {...settings.marketing, activePopups: newList}});
                         }}
                         className="w-full py-4 text-red-500 font-black text-[10px] uppercase tracking-widest border border-red-500/20 rounded-2xl hover:bg-red-500/5 transition-all"
                      >
                         حذف کامل کمپین
                      </button>
                   </div>
                </div>
              </div>
            ))}
         </div>
      </div>

      <div className="bg-white dark:bg-[#0a0a1a] rounded-[48px] border border-muted/10 shadow-2xl p-10">
         <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
               <TrendingUp className="text-green-500" size={24}/>
               <h3 className="text-xl font-black">تنظیمات تایید اجتماعی (Social Proof)</h3>
            </div>
            <button 
               onClick={() => setSettings({...settings, marketing: {...settings.marketing, showSocialProof: !settings.marketing.showSocialProof}})}
               className={`w-14 h-7 rounded-full transition-all relative ${settings.marketing.showSocialProof ? 'bg-brand' : 'bg-muted/20'}`}
            >
               <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${settings.marketing.showSocialProof ? 'right-8' : 'right-1'}`} />
            </button>
         </div>
         <p className="text-[11px] font-bold text-muted-foreground leading-relaxed max-w-2xl">
            با فعالسازی این گزینه، اعلان‌های کوچکی در گوشه سایت به کاربران نمایش داده می‌شود که نشان‌دهنده فعالیت‌های اخیر مشتریان دیگر است. این تکنیک باعث ایجاد حس اعتماد و ترغیب به خرید سریع‌تر می‌شود.
         </p>
      </div>
    </div>
  );
};

export default MarketingHub;
