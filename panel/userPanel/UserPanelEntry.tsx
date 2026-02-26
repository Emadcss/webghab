
"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User as UserIcon, MapPin, Package, Heart, 
  Settings, LogOut, ArrowRight, ShieldCheck, 
  CreditCard, ChevronLeft, LayoutDashboard
} from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import AddressManager from './AddressManager';
import OrderHistory from './OrderHistory';

const UserPanelEntry: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, logout, fetchUserOrders } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'addresses' | 'orders'>('overview');

  useEffect(() => {
    if (activeTab === 'orders') fetchUserOrders();
  }, [activeTab]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#030308] animate-slide-in">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-4 bg-white dark:bg-white/5 rounded-2xl shadow-xl hover:bg-brand transition-all group">
              <ArrowRight size={24} className="group-hover:text-primary" />
            </button>
            <h1 className="text-4xl font-black">میز کاربری هوشمند</h1>
          </div>
          <button onClick={logout} className="px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold text-xs">خروج از حساب</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Menu */}
          <aside className="lg:col-span-3 space-y-4">
             <div className="bg-white dark:bg-[#111122] p-8 rounded-[40px] shadow-xl text-center border border-muted/5">
                <div className="w-20 h-20 bg-brand text-primary rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl font-black shadow-lg">
                   {user.name.charAt(0)}
                </div>
                <h3 className="font-black text-lg">{user.name}</h3>
                <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-widest">{user.role}</p>
             </div>

             <nav className="bg-white dark:bg-[#111122] p-4 rounded-[40px] shadow-xl space-y-2 border border-muted/5">
                {[
                  { id: 'overview', label: 'داشبورد', icon: LayoutDashboard },
                  { id: 'profile', label: 'تنظیمات پروفایل', icon: Settings },
                  { id: 'addresses', label: 'مدیریت نشانی‌ها', icon: MapPin },
                  { id: 'orders', label: 'تاریخچه سفارشات', icon: Package },
                ].map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black text-xs ${activeTab === item.id ? 'bg-brand text-primary' : 'text-muted hover:bg-brand/5'}`}
                  >
                    <item.icon size={18} /> {item.label}
                  </button>
                ))}
             </nav>
          </aside>

          {/* Dynamic Content Area */}
          <main className="lg:col-span-9">
             <div className="bg-white dark:bg-[#111122] p-10 rounded-[48px] shadow-2xl border border-muted/5 min-h-[600px]">
                {activeTab === 'overview' && (
                  <div className="space-y-10 animate-slide-up">
                     <h2 className="text-2xl font-black">در یک نگاه</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-8 bg-brand/10 rounded-[32px] border border-brand/20">
                           <CreditCard className="text-brand mb-4" size={32}/>
                           <p className="text-xs font-bold text-muted mb-1">موجودی کیف پول</p>
                           <h4 className="text-xl font-black">۰ تومان</h4>
                        </div>
                        <div className="p-8 bg-blue-500/10 rounded-[32px] border border-blue-500/20">
                           <Package className="text-blue-500 mb-4" size={32}/>
                           <p className="text-xs font-bold text-muted mb-1">سفارشات جاری</p>
                           <h4 className="text-xl font-black">۰ مورد</h4>
                        </div>
                        <div className="p-8 bg-green-500/10 rounded-[32px] border border-green-500/20">
                           <ShieldCheck className="text-green-500 mb-4" size={32}/>
                           <p className="text-xs font-bold text-muted mb-1">وضعیت حساب</p>
                           <h4 className="text-xl font-black text-green-500">تایید شده</h4>
                        </div>
                     </div>
                  </div>
                )}
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'addresses' && <AddressManager />}
                {activeTab === 'orders' && <OrderHistory />}
             </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserPanelEntry;
