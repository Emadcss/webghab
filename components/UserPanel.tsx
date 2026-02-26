
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, MapPin, Package, Heart, 
  Settings, LogOut, ArrowRight, ShieldCheck, 
  CreditCard, ChevronLeft, Clock, 
  Plus, Trash2, Map, MessageSquare, Save, Edit3, 
  Smartphone, Hash, Globe, UserCircle, Briefcase, Star, CheckCircle
} from 'lucide-react';
import { toPersianDigits, formatPrice, toPersianDigitsGlobal, sanitizeInput } from '../utils/helpers';
import { ValidationRules } from '../utils/validation';
import { UserRole, Address, ProductComment, Product } from '../types';
import { PROVINCES, CITIES } from '../data/iran-cities';

const UserPanel: React.FC<{ onBack: () => void; initialTab?: string }> = ({ onBack, initialTab = 'overview' }) => {
  const { user, logout, orders, products, topUpWallet, addNotification, updateUser, addAddress, updateAddress, deleteAddress, comments } = useApp();
  const [activeSection, setActiveSection] = useState(initialTab);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Profile States
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    nationalId: user?.nationalId || '',
    email: user?.email || ''
  });

  // Address Modal States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  if (!user) return null;

  const userOrders = orders.filter(o => o.userId === user.id);
  const userComments = comments.filter(c => c.userId === user.id);
  const wishlistProducts = products.filter(p => user.wishlist.includes(p.id));

  const handleUpdateProfile = () => {
    const firstNameErr = ValidationRules.required(profileForm.firstName, 'نام');
    const lastNameErr = ValidationRules.required(profileForm.lastName, 'نام خانوادگی');
    const phoneError = ValidationRules.phone(profileForm.phone);
    const nIdError = ValidationRules.nationalId(profileForm.nationalId);
    
    const firstError = firstNameErr || lastNameErr || phoneError || nIdError;
    if (firstError) {
      addNotification(firstError, 'error');
      return;
    }

    updateUser({ 
      ...user, 
      ...profileForm, 
      name: `${profileForm.firstName} ${profileForm.lastName}`.trim() 
    });
    addNotification('پروفایل با موفقیت بروزرسانی شد.', 'success');
  };

  const handleTopUp = () => {
    const amount = Number(topUpAmount);
    if (amount < 100000) {
      addNotification('حداقل مبلغ شارژ ۱۰۰ هزار تومان است.', 'warning');
      return;
    }
    setIsProcessingPayment(true);
    setTimeout(() => {
      topUpWallet(amount);
      setIsProcessingPayment(false);
      setTopUpAmount('');
      addNotification('تراکنش موفق! موجودی کیف پول افزایش یافت.', 'success');
    }, 2000);
  };

  const AddressModal = () => {
    const [addrForm, setAddrForm] = useState<Partial<Address>>(editingAddress || {
      title: '', receiverName: '', phone: '', province: 'تهران', city: 'تهران', fullAddress: '', postalCode: '', plaque: '', unit: '', isDefault: false
    });

    // Dynamic City Filter based on Province
    const currentProvinceId = useMemo(() => PROVINCES.find(p => p.name === addrForm.province)?.id, [addrForm.province]);
    const filteredCities = useMemo(() => CITIES.filter(c => c.province_id === currentProvinceId), [currentProvinceId]);

    const handleSaveAddress = () => {
      // Validations from utils/validation.ts
      const errors = [
        ValidationRules.required(addrForm.title, 'عنوان'),
        ValidationRules.required(addrForm.receiverName, 'نام گیرنده'),
        ValidationRules.phone(addrForm.phone || ''),
        ValidationRules.postalCode(addrForm.postalCode || ''),
        ValidationRules.required(addrForm.city, 'شهر'),
        ValidationRules.required(addrForm.fullAddress, 'نشانی پستی')
      ].filter(Boolean);

      if (errors.length > 0) {
        addNotification(errors[0] as string, 'error');
        return;
      }

      if (editingAddress) {
        updateAddress(addrForm as Address);
      } else {
        addAddress(addrForm as Address);
      }
      setIsAddressModalOpen(false);
      addNotification('نشانی با موفقیت ثبت شد.', 'success');
    };

    return (
      <div className="fixed inset-0 z-[3100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAddressModalOpen(false)} />
        <div className="relative w-full max-w-2xl bg-white dark:bg-[#080815] rounded-[40px] p-8 md:p-12 animate-slide-up border border-white/10 overflow-y-auto max-h-[90vh]">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-brand">
            <MapPin size={32}/> {editingAddress ? 'ویرایش نشانی' : 'افزودن نشانی جدید'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase">عنوان آدرس *</label>
              <input value={addrForm.title} onChange={e=>setAddrForm({...addrForm, title: e.target.value})} placeholder="مثلا: منزل، محل کار" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-muted/10 outline-none font-bold text-xs focus:border-brand" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase">نام گیرنده *</label>
              <input value={addrForm.receiverName} onChange={e=>setAddrForm({...addrForm, receiverName: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-muted/10 outline-none font-bold text-xs focus:border-brand" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase">شماره تماس *</label>
              <input value={addrForm.phone} onChange={e=>setAddrForm({...addrForm, phone: e.target.value})} dir="ltr" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-muted/10 outline-none font-bold text-xs text-left" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase">کد پستی (۱۶ رقم) *</label>
              <input value={addrForm.postalCode} onChange={e=>setAddrForm({...addrForm, postalCode: e.target.value})} dir="ltr" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-muted/10 outline-none font-bold text-xs text-left" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase">استان *</label>
              <select 
                value={addrForm.province} 
                onChange={e => setAddrForm({...addrForm, province: e.target.value, city: ''})} 
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-muted/10 outline-none font-bold text-xs"
              >
                {PROVINCES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase">شهر *</label>
              <select 
                value={addrForm.city} 
                onChange={e => setAddrForm({...addrForm, city: e.target.value})} 
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-muted/10 outline-none font-bold text-xs"
              >
                <option value="">انتخاب شهر...</option>
                {filteredCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="col-span-full space-y-2">
              <label className="text-[10px] font-black text-muted uppercase">آدرس دقیق پستی *</label>
              <textarea value={addrForm.fullAddress} onChange={e=>setAddrForm({...addrForm, fullAddress: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-muted/10 outline-none font-bold text-xs h-24 focus:border-brand" />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" checked={addrForm.isDefault} onChange={e=>setAddrForm({...addrForm, isDefault: e.target.checked})} className="w-5 h-5 accent-brand" />
              <span className="text-[11px] font-black">انتخاب به عنوان آدرس پیش‌فرض</span>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button onClick={handleSaveAddress} className="flex-1 bg-brand text-primary py-5 rounded-[24px] font-black shadow-xl hover:scale-[1.02] transition-all">ذخیره نهایی نشانی</button>
            <button onClick={() => setIsAddressModalOpen(false)} className="px-10 py-5 rounded-[24px] bg-slate-100 dark:bg-white/5 font-black text-xs">انصراف</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-slide-in pb-32">
      {isAddressModalOpen && <AddressModal />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="w-14 h-14 bg-white dark:bg-white/5 rounded-[22px] flex items-center justify-center shadow-xl border border-muted/10 hover:bg-brand transition-all group">
            <ArrowRight size={24} className="group-hover:text-primary" />
          </button>
          <h2 className="text-4xl font-black">میز کاربری</h2>
        </div>
        <button onClick={logout} className="px-8 py-4 bg-red-500/10 text-red-500 rounded-[22px] font-black text-xs hover:bg-red-500 hover:text-white transition-all">خروج از حساب</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-[#111122] p-8 rounded-[48px] border border-muted/10 shadow-xl text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-brand" />
             <div className="w-24 h-24 bg-brand/10 text-brand rounded-[40px] flex items-center justify-center mx-auto mb-6 text-3xl font-black shadow-inner">
                {user.name.charAt(0)}
             </div>
             <h3 className="font-black text-lg">{user.name}</h3>
             <p className="text-[9px] text-muted font-black mt-1 uppercase tracking-[3px] opacity-60">Gold Member</p>
          </div>

          <nav className="bg-white dark:bg-[#111122] p-4 rounded-[40px] border border-muted/10 shadow-xl space-y-1">
            {[
              { id: 'overview', label: 'داشبورد', icon: UserCircle },
              { id: 'profile', label: 'تکمیل اطلاعات', icon: Settings },
              { id: 'wallet', label: 'کیف پول', icon: CreditCard },
              { id: 'addresses', label: 'نشانی‌ها', icon: MapPin },
              { id: 'orders', label: 'سفارشات', icon: Package },
              { id: 'wishlist', label: 'علاقه‌مندی‌ها', icon: Heart },
              { id: 'comments', label: 'نظرات من', icon: MessageSquare }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveSection(item.id)} 
                className={`w-full flex items-center gap-4 p-5 rounded-[24px] transition-all font-black text-xs ${activeSection === item.id ? 'bg-brand text-primary shadow-lg' : 'text-muted hover:bg-brand/5'}`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="lg:col-span-9 space-y-10">
           {activeSection === 'profile' && (
             <div className="bg-white dark:bg-[#111122] p-10 rounded-[48px] border border-muted/10 shadow-xl animate-slide-up">
                <h3 className="text-xl font-black mb-10 flex items-center gap-4"><Settings className="text-brand" size={24}/> تنظیمات حساب کاربری</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase">نام</label>
                      <input value={profileForm.firstName} onChange={e=>setProfileForm({...profileForm, firstName: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-muted/10 outline-none font-bold text-sm focus:border-brand" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase">نام خانوادگی</label>
                      <input value={profileForm.lastName} onChange={e=>setProfileForm({...profileForm, lastName: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-muted/10 outline-none font-bold text-sm focus:border-brand" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase">شماره همراه</label>
                      <input value={profileForm.phone} onChange={e=>setProfileForm({...profileForm, phone: e.target.value})} dir="ltr" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-muted/10 outline-none font-bold text-sm text-left" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase">کد ملی</label>
                      <input value={profileForm.nationalId} onChange={e=>setProfileForm({...profileForm, nationalId: e.target.value})} dir="ltr" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-muted/10 outline-none font-bold text-sm text-left" />
                   </div>
                </div>
                <button onClick={handleUpdateProfile} className="mt-12 bg-primary dark:bg-brand text-white dark:text-primary px-12 py-5 rounded-[24px] font-black text-sm flex items-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                   <Save size={20}/> بروزرسانی پروفایل
                </button>
             </div>
           )}

           {activeSection === 'addresses' && (
             <div className="bg-white dark:bg-[#111122] p-10 rounded-[48px] border border-muted/10 shadow-xl animate-slide-up">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-black flex items-center gap-4"><MapPin className="text-brand" size={24}/> نشانی‌های تحویل</h3>
                   <button onClick={() => { setEditingAddress(null); setIsAddressModalOpen(true); }} className="bg-brand text-primary px-8 py-3 rounded-2xl text-[10px] font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
                      <Plus size={16}/> افزودن نشانی جدید
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {user.addresses.map(addr => (
                     <div key={addr.id} className={`p-8 rounded-[36px] border-2 transition-all flex flex-col justify-between group ${addr.isDefault ? 'border-brand bg-brand/5' : 'border-muted/10 bg-slate-50 dark:bg-white/5 hover:border-brand/40'}`}>
                        <div>
                           <div className="flex justify-between items-start mb-4">
                              <h4 className="font-black text-sm">{addr.title} {addr.isDefault && <span className="bg-brand text-primary text-[8px] px-2 py-0.5 rounded-full mr-2">پیش‌فرض</span>}</h4>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={()=>{setEditingAddress(addr); setIsAddressModalOpen(true);}} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"><Edit3 size={16}/></button>
                                 <button onClick={()=>deleteAddress(addr.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16}/></button>
                              </div>
                           </div>
                           <p className="text-xs font-bold text-muted-foreground leading-relaxed line-clamp-3 mb-6">{addr.province}، {addr.city}، {addr.fullAddress}</p>
                        </div>
                        <div className="pt-4 border-t border-muted/10 flex items-center justify-between text-[9px] font-black opacity-60">
                           <div className="flex items-center gap-2"><Smartphone size={14}/> {toPersianDigitsGlobal(addr.phone)}</div>
                           <div className="flex items-center gap-2"><Briefcase size={14}/> {addr.receiverName}</div>
                        </div>
                     </div>
                   ))}
                   {user.addresses.length === 0 && (
                     <div className="col-span-full py-20 text-center opacity-30">
                        <Map size={64} className="mx-auto mb-4" />
                        <p className="font-black italic">هنوز هیچ نشانی ثبت نکرده‌اید.</p>
                     </div>
                   )}
                </div>
             </div>
           )}

           {activeSection === 'wishlist' && (
             <div className="bg-white dark:bg-[#111122] p-10 rounded-[48px] border border-muted/10 shadow-xl animate-slide-up">
                <h3 className="text-xl font-black mb-10 flex items-center gap-4"><Heart className="text-red-500" size={24}/> لیست علاقه‌مندی‌ها</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                   {wishlistProducts.map(p => (
                     <div key={p.id} className="group p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-muted/5 hover:border-brand transition-all">
                        <img src={p.image} className="w-full aspect-square object-cover rounded-2xl mb-4" />
                        <h4 className="text-[10px] font-black line-clamp-1">{p.name}</h4>
                        <div className="flex justify-between items-center mt-3">
                           <span className="text-brand font-black text-xs">{formatPrice(p.price)} ت</span>
                           <button className="p-2 bg-brand/10 text-brand rounded-lg"><ChevronLeft size={16}/></button>
                        </div>
                     </div>
                   ))}
                   {wishlistProducts.length === 0 && <p className="col-span-full py-20 text-center text-muted font-bold italic">لیست شما خالی است.</p>}
                </div>
             </div>
           )}

           {activeSection === 'comments' && (
             <div className="bg-white dark:bg-[#111122] p-10 rounded-[48px] border border-muted/10 shadow-xl animate-slide-up">
                <h3 className="text-xl font-black mb-10 flex items-center gap-4"><MessageSquare className="text-brand" size={24}/> نظرات من</h3>
                <div className="space-y-6">
                   {userComments.map(c => (
                     <div key={c.id} className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-muted/5 relative">
                        <div className="flex justify-between items-center mb-4">
                           <div className="flex gap-1">
                              {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= c.rating ? 'fill-brand text-brand' : 'text-muted/20'} />)}
                           </div>
                           <span className="text-[8px] font-black text-muted">{toPersianDigitsGlobal(new Date(c.timestamp).toLocaleDateString('fa-IR'))}</span>
                        </div>
                        <p className="text-xs font-bold leading-relaxed">{c.text}</p>
                     </div>
                   ))}
                   {userComments.length === 0 && <p className="py-20 text-center text-muted font-bold italic">هنوز نظری ثبت نکرده‌اید.</p>}
                </div>
             </div>
           )}

           {activeSection === 'overview' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
                <div className="bg-white dark:bg-[#111122] p-10 rounded-[48px] border border-muted/10 shadow-xl">
                   <h3 className="text-lg font-black mb-8 flex items-center gap-3"><Clock size={22} className="text-brand" /> سفارشات اخیر</h3>
                   <div className="space-y-4">
                      {userOrders.slice(0, 3).map(order => (
                        <div key={order.id} className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl flex justify-between items-center group cursor-pointer hover:bg-brand/10 transition-all">
                           <div className="text-right">
                              <p className="text-xs font-black tabular-nums">سفارش {toPersianDigitsGlobal(order.id)}</p>
                              <p className="text-[9px] text-muted font-bold mt-1 tabular-nums">{formatPrice(order.totalAmount)} تومان</p>
                           </div>
                           <ChevronLeft size={16} className="text-muted group-hover:text-brand" />
                        </div>
                      ))}
                      {userOrders.length === 0 && <p className="text-center py-10 opacity-30 italic font-black text-xs">سفارشی یافت نشد.</p>}
                   </div>
                </div>

                <div className="bg-[#000038] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10"><CheckCircle size={120} /></div>
                   <h3 className="text-lg font-black mb-6">وضعیت حساب</h3>
                   <p className="text-[11px] font-medium opacity-60 leading-relaxed mb-10">اطلاعات شما در وب‌قاب به صورت رمزنگاری شده نگهداری می‌شود. امنیت، اولویت ماست.</p>
                   <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/20">
                      <ShieldCheck size={20} className="text-brand" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Verified Account</span>
                   </div>
                </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
};

export default UserPanel;
