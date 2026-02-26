
import React, { useState } from 'react';
import { 
  Monitor, Layout, Save, Plus, Trash2, 
  Image as ImageIcon, Type, Link as LinkIcon, 
  MessageSquare, Hash, Zap, Grid, Box, X,
  Instagram, Send, Phone, Mail, MapPin, Globe, Copyright
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppearanceSettings, HeroSlide, PromoBanner } from '../../types';

const AppearanceManagement: React.FC = () => {
  const { appearance, updateAppearance, addNotification, products } = useApp();
  const [tab, setTab] = useState<'hero' | 'promo' | 'special' | 'footer'>('hero');
  const [settings, setSettings] = useState<AppearanceSettings>(appearance);

  const handleSave = async () => {
    await updateAppearance(settings);
    addNotification('تغییرات با موفقیت در سایت اعمال شد.', 'success');
  };

  const addHeroSlide = () => {
    const newSlide: HeroSlide = { id: `hero-${Date.now()}`, image: '', tag: 'جدید', title: 'عنوان', desc: 'توضیحات', link: '#', bgColor: 'bg-primary' };
    setSettings({ ...settings, heroSlides: [...settings.heroSlides, newSlide] });
  };

  const addPromoBanner = () => {
    const newBanner: PromoBanner = { id: `bn-${Date.now()}`, title: 'کمپین جدید', image: '', link: '#', label: 'تخفیف' };
    if (settings.promoBanners.length >= 4) {
      addNotification('حداکثر ۴ بنر مجاز است.', 'warning');
      return;
    }
    setSettings({ ...settings, promoBanners: [...settings.promoBanners, newBanner] });
  };

  const updateFooter = (field: string, val: string) => {
    setSettings({
      ...settings,
      footer: { ...settings.footer, [field]: val }
    });
  };

  return (
    <div className="space-y-10 animate-slide-in pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black">مهندسی ویترین وب‌قاب</h2>
          <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">Storefront visual controller</p>
        </div>
        <button onClick={handleSave} className="bg-brand text-primary px-10 py-4 rounded-[20px] font-black text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
          <Save size={20} /> ذخیره و انتشار سراسری
        </button>
      </header>

      <nav className="flex bg-white dark:bg-white/5 p-2 rounded-[24px] gap-2 overflow-x-auto no-scrollbar border border-muted/5 shadow-md">
        {[
          { id: 'hero', label: 'هیرو اسلایدر', icon: Monitor },
          { id: 'promo', label: 'بنرهای ۴ تایی', icon: Grid },
          { id: 'special', label: 'شگفت‌انگیز', icon: Zap },
          { id: 'footer', label: 'مدیریت فوتر', icon: Hash }
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)} className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black transition-all ${tab === t.id ? 'bg-brand text-primary shadow-lg' : 'text-muted hover:bg-brand/10'}`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </nav>

      <main className="bg-white dark:bg-[#0a0a1a] rounded-[40px] p-8 md:p-10 border border-muted/10 shadow-2xl min-h-[500px]">
        {tab === 'hero' && (
          <div className="space-y-8 animate-slide-up">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black">اسلایدهای صفحه اصلی</h3>
                <button onClick={addHeroSlide} className="bg-brand/10 text-brand px-5 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 hover:bg-brand hover:text-primary transition-all"><Plus size={16}/> افزودن اسلاید</button>
             </div>
             <div className="space-y-6">
                {settings.heroSlides.map((slide, idx) => (
                  <div key={slide.id} className="p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-muted/5 grid grid-cols-1 md:grid-cols-2 gap-8 relative group">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-muted uppercase">لینک تصویر (Crisp Image URL)</label>
                        <input value={slide.image} onChange={e=>{
                          const newList = [...settings.heroSlides]; newList[idx].image = e.target.value; setSettings({...settings, heroSlides: newList});
                        }} className="w-full p-4 rounded-xl bg-white dark:bg-black text-[10px] font-bold outline-none border border-muted/10" />
                        <div className="aspect-[21/9] rounded-xl overflow-hidden bg-black/10 border-2 border-dashed border-muted/20">
                           {slide.image && <img src={slide.image} className="w-full h-full object-cover" alt="Preview" />}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-muted uppercase">محتوای متنی</label>
                        <input placeholder="عنوان اصلی" value={slide.title} onChange={e=>{
                          const newList = [...settings.heroSlides]; newList[idx].title = e.target.value; setSettings({...settings, heroSlides: newList});
                        }} className="w-full p-4 rounded-xl bg-white dark:bg-black text-xs font-black outline-none border border-muted/10" />
                        <textarea placeholder="توضیحات" value={slide.desc} onChange={e=>{
                          const newList = [...settings.heroSlides]; newList[idx].desc = e.target.value; setSettings({...settings, heroSlides: newList});
                        }} className="w-full p-4 rounded-xl bg-white dark:bg-black text-xs font-bold outline-none h-24 border border-muted/10 resize-none" />
                        <div className="flex gap-2">
                           <input placeholder="برچسب" value={slide.tag} onChange={e=>{
                             const newList = [...settings.heroSlides]; newList[idx].tag = e.target.value; setSettings({...settings, heroSlides: newList});
                           }} className="flex-1 p-4 rounded-xl bg-white dark:bg-black text-xs font-bold outline-none border border-muted/10" />
                           <button onClick={()=>setSettings({...settings, heroSlides: settings.heroSlides.filter(s=>s.id!==slide.id)})} className="p-4 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={20}/></button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {tab === 'promo' && (
          <div className="space-y-8 animate-slide-up">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-black">بنرهای تبلیغاتی شبکه (Grid)</h3>
                <button onClick={addPromoBanner} className="bg-brand/10 text-brand px-5 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 hover:bg-brand hover:text-primary transition-all"><Plus size={16}/> افزودن بنر</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settings.promoBanners.map((banner, idx) => (
                  <div key={banner.id} className="p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-muted/5 space-y-4">
                     <div className="flex gap-4">
                        <div className="w-24 h-24 bg-white dark:bg-black rounded-xl border border-muted/10 overflow-hidden shrink-0">
                           {banner.image && <img src={banner.image} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 space-y-3">
                           <input placeholder="عنوان بنر" value={banner.title} onChange={e=>{
                             const newList = [...settings.promoBanners]; newList[idx].title = e.target.value; setSettings({...settings, promoBanners: newList});
                           }} className="w-full p-3 rounded-lg bg-white dark:bg-black text-[11px] font-black outline-none border border-muted/10" />
                           <input placeholder="متن برچسب (مثلا: تخفیف)" value={banner.label} onChange={e=>{
                             const newList = [...settings.promoBanners]; newList[idx].label = e.target.value; setSettings({...settings, promoBanners: newList});
                           }} className="w-full p-3 rounded-lg bg-white dark:bg-black text-[10px] font-bold outline-none border border-muted/10" />
                        </div>
                     </div>
                     <input placeholder="Image URL" value={banner.image} onChange={e=>{
                       const newList = [...settings.promoBanners]; newList[idx].image = e.target.value; setSettings({...settings, promoBanners: newList});
                     }} className="w-full p-3 rounded-lg bg-white dark:bg-black text-[9px] font-mono outline-none border border-muted/10" />
                     <div className="flex justify-between items-center">
                        <input placeholder="Link URL" value={banner.link} onChange={e=>{
                          const newList = [...settings.promoBanners]; newList[idx].link = e.target.value; setSettings({...settings, promoBanners: newList});
                        }} className="flex-1 p-3 rounded-lg bg-white dark:bg-black text-[9px] font-mono outline-none border border-muted/10 ml-3" />
                        <button onClick={()=>setSettings({...settings, promoBanners: settings.promoBanners.filter(b=>b.id!==banner.id)})} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {tab === 'special' && (
           <div className="space-y-10 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <h3 className="text-xl font-black">تنظیمات محتوا</h3>
                    <div className="space-y-4 p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-muted/5">
                       <label className="text-[10px] font-black text-muted uppercase">عنوان باکس</label>
                       <input value={settings.specialOffer.title} onChange={e=>setSettings({...settings, specialOffer: {...settings.specialOffer, title: e.target.value}})} className="w-full p-4 rounded-xl bg-white dark:bg-black text-xs font-black outline-none" />
                       <label className="text-[10px] font-black text-muted uppercase">متن زیرعنوان</label>
                       <input value={settings.specialOffer.subtitle} onChange={e=>setSettings({...settings, specialOffer: {...settings.specialOffer, subtitle: e.target.value}})} className="w-full p-4 rounded-xl bg-white dark:bg-black text-xs font-bold outline-none" />
                    </div>
                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-muted/5">
                       <span className="text-xs font-black">نمایش تایمر معکوس</span>
                       <button onClick={()=>setSettings({...settings, specialOffer: {...settings.specialOffer, showTimer: !settings.specialOffer.showTimer}})} className={`w-14 h-7 rounded-full transition-all relative ${settings.specialOffer.showTimer ? 'bg-brand' : 'bg-muted/30'}`}>
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${settings.specialOffer.showTimer ? 'right-8' : 'right-1'}`} />
                       </button>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-xl font-black">کالاهای شگفت‌انگیز</h3>
                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-muted/5 min-h-[300px]">
                       <p className="text-[9px] font-black text-muted uppercase mb-4 tracking-widest">کالاهای انتخاب شده:</p>
                       <div className="space-y-3">
                          {settings.specialOffer.productIds.map(pid => {
                            const p = products.find(x => x.id === pid);
                            return (
                              <div key={pid} className="flex items-center justify-between p-3 bg-white dark:bg-black rounded-xl border border-muted/10 shadow-sm">
                                 <div className="flex items-center gap-3">
                                    <img src={p?.image} className="w-8 h-8 object-contain" />
                                    <span className="text-[10px] font-black truncate max-w-[150px]">{p?.name}</span>
                                 </div>
                                 <button onClick={() => setSettings({...settings, specialOffer: {...settings.specialOffer, productIds: settings.specialOffer.productIds.filter(id => id !== pid)}})} className="text-red-500 p-1 hover:bg-red-500/10 rounded-lg"><X size={14}/></button>
                              </div>
                            );
                          })}
                       </div>
                       <div className="mt-8 pt-8 border-t border-muted/10">
                          <label className="text-[9px] font-black text-muted uppercase block mb-3">افزودن کالا از لیست انبار</label>
                          <select 
                            onChange={(e) => {
                              if (e.target.value && !settings.specialOffer.productIds.includes(e.target.value)) {
                                setSettings({...settings, specialOffer: {...settings.specialOffer, productIds: [...settings.specialOffer.productIds, e.target.value]}});
                              }
                            }}
                            className="w-full p-4 rounded-xl bg-white dark:bg-black text-[10px] font-bold outline-none border border-muted/10"
                          >
                             <option value="">انتخاب کالا برای حراج...</option>
                             {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {tab === 'footer' && (
          <div className="animate-slide-up space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h3 className="text-xl font-black flex items-center gap-3"><Type className="text-brand" /> بخش درباره فروشگاه</h3>
                   <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-muted/5 space-y-4">
                      <label className="text-[10px] font-black text-muted uppercase">متن معرف (About Us)</label>
                      <textarea 
                        value={settings.footer.aboutText} 
                        onChange={e => updateFooter('aboutText', e.target.value)}
                        className="w-full h-32 p-4 bg-white dark:bg-black rounded-xl text-xs font-medium leading-relaxed outline-none border border-muted/10"
                      />
                      <label className="text-[10px] font-black text-muted uppercase">متن کپی‌رایت</label>
                      <input 
                        value={settings.footer.copyright} 
                        onChange={e => updateFooter('copyright', e.target.value)}
                        className="w-full p-4 bg-white dark:bg-black rounded-xl text-xs font-bold outline-none border border-muted/10"
                      />
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-xl font-black flex items-center gap-3"><Instagram className="text-brand" /> شبکه‌های اجتماعی و تماس</h3>
                   <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-muted/5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted flex items-center gap-2"><Instagram size={14}/> اینستاگرام</label>
                            <input value={settings.footer.instagram} onChange={e=>updateFooter('instagram', e.target.value)} className="w-full p-3 bg-white dark:bg-black rounded-xl text-xs outline-none" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted flex items-center gap-2"><Send size={14}/> تلگرام</label>
                            <input value={settings.footer.telegram} onChange={e=>updateFooter('telegram', e.target.value)} className="w-full p-3 bg-white dark:bg-black rounded-xl text-xs outline-none" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-muted flex items-center gap-2"><Phone size={14}/> شماره تماس پشتیبانی</label>
                         <input value={settings.footer.phone} onChange={e=>updateFooter('phone', e.target.value)} className="w-full p-4 bg-white dark:bg-black rounded-xl text-xs outline-none" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-muted flex items-center gap-2"><Mail size={14}/> ایمیل سازمانی</label>
                         <input value={settings.footer.email} onChange={e=>updateFooter('email', e.target.value)} className="w-full p-4 bg-white dark:bg-black rounded-xl text-xs outline-none" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-muted flex items-center gap-2"><MapPin size={14}/> نشانی دفتر مرکزی</label>
                         <input value={settings.footer.address} onChange={e=>updateFooter('address', e.target.value)} className="w-full p-4 bg-white dark:bg-black rounded-xl text-xs outline-none" />
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="bg-brand/5 border border-brand/10 p-6 rounded-[32px] flex items-center gap-4">
                <Globe className="text-brand shrink-0" size={32}/>
                <div>
                   <h4 className="text-xs font-black">پیش‌نمایش فوتر</h4>
                   <p className="text-[10px] text-muted-foreground">تغییرات شما به صورت آنی در تمام صفحات فروشگاه وب‌قاب منعکس می‌شود.</p>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppearanceManagement;
