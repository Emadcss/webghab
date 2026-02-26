
import React, { useState } from 'react';
import { 
  LayoutDashboard, Box, SlidersHorizontal, LogOut, X, Menu, ShoppingCart, Users, 
  BarChart3, MessageSquare, Layers, ShieldAlert, ChevronDown, ChevronLeft, 
  Settings, CreditCard, PieChart, Star, Percent
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

// Modular Components
import Dashboard from '../panel/adminPanel/Dashboard';
import ProductManagement from '../panel/adminPanel/ProductManagement';
import AttributeManagement from '../panel/adminPanel/AttributeManagement';
import ProductForm from '../panel/adminPanel/ProductForm';
import OrderManagement from '../panel/adminPanel/OrderManagement';
import UserManagement from '../panel/adminPanel/UserManagement';
import Reports from '../panel/adminPanel/Reports';
import CrmManagement from '../panel/adminPanel/CrmManagement';
import CategoryManagement from '../panel/adminPanel/CategoryManagement';
import ModerationManagement from '../panel/adminPanel/ModerationManagement';

const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addProduct, updateProduct } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['store']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleSaveProduct = (p: Product) => {
    if (editingProduct) updateProduct(p);
    else addProduct(p);
    setShowProductModal(false);
  };

  const menuGroups = [
    {
      id: 'store',
      label: 'مدیریت فروشگاه',
      icon: Box,
      items: [
        { id: 'products', label: 'کالاها و انبار', icon: Box },
        { id: 'categories', label: 'ساختار دسته‌ها (Mega Menu)', icon: Layers },
        { id: 'attributes', label: 'ویژگی‌های فنی و پایه', icon: SlidersHorizontal },
      ]
    },
    {
      id: 'finance',
      label: 'عملیات مالی',
      icon: CreditCard,
      items: [
        { id: 'orders', label: 'سفارشات و فاکتورها', icon: ShoppingCart },
        { id: 'reports', label: 'گزارشات و تحلیل سود', icon: PieChart },
      ]
    },
    {
      id: 'customers',
      label: 'مرکز مشتریان',
      icon: Users,
      items: [
        { id: 'users', label: 'مدیریت کاربران', icon: Users },
        { id: 'crm', label: 'تیکت‌های پشتیبانی', icon: MessageSquare },
      ]
    },
    {
      id: 'content',
      label: 'محتوا و امنیت',
      icon: ShieldAlert,
      items: [
        { id: 'moderation', label: 'نظرات و فیلترینگ', icon: Star },
        { id: 'settings', label: 'تنظیمات کلی', icon: Settings },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-50 dark:bg-black flex animate-slide-in overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-[1020] w-80 bg-primary dark:bg-[#00001a] text-white flex flex-col p-6 border-l border-white/5 transition-transform md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="mb-10 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center text-primary font-black shadow-lg shadow-brand/20">W</div>
            <div>
               <h1 className="text-lg font-black tracking-tight">پنل مدیریت لوکس</h1>
               <p className="text-[8px] font-bold text-brand uppercase tracking-[2px]">Enterprise WebGhab</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-white/40"><X size={20}/></button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all mb-4 ${activeTab === 'dashboard' ? 'bg-brand text-primary shadow-xl font-black' : 'text-white/60 hover:bg-white/5 font-bold'}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-xs">پیشخوان اصلی</span>
          </button>

          {menuGroups.map(group => (
            <div key={group.id} className="space-y-1">
               <button 
                 onClick={() => toggleMenu(group.id)}
                 className="w-full flex items-center justify-between p-4 text-white/40 hover:text-white transition-colors"
               >
                  <div className="flex items-center gap-4">
                     <group.icon size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">{group.label}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${expandedMenus.includes(group.id) ? 'rotate-180' : ''}`} />
               </button>
               
               {expandedMenus.includes(group.id) && (
                 <div className="space-y-1 pr-4 animate-slide-down">
                    {group.items.map(item => (
                      <button 
                        key={item.id} 
                        onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all text-xs ${activeTab === item.id ? 'bg-white/10 text-brand font-black' : 'text-white/60 hover:bg-white/5 font-bold'}`}
                      >
                         <div className={`w-1.5 h-1.5 rounded-full ${activeTab === item.id ? 'bg-brand' : 'bg-transparent'}`} />
                         {item.label}
                      </button>
                    ))}
                 </div>
               )}
            </div>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-white/5">
          <button onClick={onClose} className="w-full flex items-center gap-4 p-4 text-red-400 font-black text-xs hover:bg-red-500/10 rounded-2xl transition-all">
            <LogOut size={20} /> خروج از مدیریت
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-surface dark:bg-[#050510] no-scrollbar">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'products' && (
          <ProductManagement 
            onAdd={() => { setEditingProduct(null); setShowProductModal(true); }}
            onEdit={(p) => { setEditingProduct(p); setShowProductModal(true); }}
          />
        )}
        {activeTab === 'categories' && <CategoryManagement />}
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'crm' && <CrmManagement />}
        {activeTab === 'moderation' && <ModerationManagement />}
        {activeTab === 'attributes' && <AttributeManagement />}
        {activeTab === 'reports' && <Reports />}
      </main>

      {showProductModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowProductModal(false)} />
          <ProductForm 
            editingProduct={editingProduct} 
            onSave={handleSaveProduct} 
            onCancel={() => setShowProductModal(false)} 
          />
        </div>
      )}

      {/* Mobile Menu FAB */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden fixed bottom-6 left-6 z-[1030] bg-brand text-primary p-5 rounded-3xl shadow-2xl">
        <Menu size={28} />
      </button>
    </div>
  );
};

export default AdminPanel;
