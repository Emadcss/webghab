
"use client";

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Box, SlidersHorizontal, LogOut, X, Users, 
  MessageSquare, ChevronDown, 
  Settings, CreditCard, PieChart, Package, ListTree,
  ShoppingBag, Ticket, Truck, WalletCards, UserCog, Palette, Monitor, Megaphone, FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, UserRole, AdminPermission, BlogPost } from '../types';

// Sub-modules
import Dashboard from './adminPanel/Dashboard';
import ProductManagement from './adminPanel/ProductManagement';
import AttributeManagement from './adminPanel/AttributeManagement';
import ProductForm from './adminPanel/ProductForm';
import OrderManagement from './adminPanel/OrderManagement';
import UserManagement from './adminPanel/UserManagement';
import Reports from './adminPanel/Reports';
import CrmManagement from './adminPanel/CrmManagement';
import CategoryManagement from './adminPanel/CategoryManagement';
import ModerationManagement from './adminPanel/ModerationManagement';
import CouponManagement from './adminPanel/CouponManagement';
import ShippingManagement from './adminPanel/ShippingManagement';
import PaymentManagement from './adminPanel/PaymentManagement';
import AdminManagement from './adminPanel/AdminManagement';
import AppearanceManagement from './adminPanel/AppearanceManagement';
import MarketingHub from './adminPanel/MarketingHub';
import BlogManagement from './adminPanel/BlogManagement';
import BlogForm from './adminPanel/BlogForm';

const AdminEntry: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, updateProduct, addProduct, addBlogPost, updateBlogPost } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showBlogModal, setShowBlogModal] = useState(false);

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!user || user.role !== UserRole.ADMIN) return false;
    if (user.permissions?.includes(AdminPermission.SYSTEM_ROOT)) return true;
    return user.permissions?.includes(permission) || false;
  };

  const navigation = useMemo(() => [
    {
      id: 'visuals', label: 'مدیریت ویترین (Luxury UI)', icon: Palette,
      items: [
        { id: 'appearance', label: 'چیدمان صفحه اصلی', icon: Monitor, perm: AdminPermission.MANAGE_APPEARANCE },
        { id: 'marketing', label: 'کمپین‌های بازاریابی', icon: Megaphone, perm: AdminPermission.MANAGE_MARKETING },
        { id: 'blog', label: 'مدیریت بلاگ', icon: FileText, perm: AdminPermission.MANAGE_BLOG },
        { id: 'categories', label: 'دسته‌بندی‌ها', icon: ListTree, perm: AdminPermission.MANAGE_CATEGORIES },
      ].filter(item => hasPermission(item.perm))
    },
    {
      id: 'store', label: 'انبار و محصولات', icon: ShoppingBag,
      items: [
        { id: 'products', label: 'لیست کالاها', icon: Box, perm: AdminPermission.MANAGE_PRODUCTS },
        { id: 'attributes', label: 'ویژگی‌های فنی', icon: SlidersHorizontal, perm: AdminPermission.MANAGE_PRODUCTS },
      ].filter(item => hasPermission(item.perm))
    },
    {
      id: 'sales', label: 'فروش و مالی', icon: CreditCard,
      items: [
        { id: 'orders', label: 'سفارشات', icon: Package, perm: AdminPermission.MANAGE_ORDERS },
        { id: 'coupons', label: 'تخفیف‌ها', icon: Ticket, perm: AdminPermission.MANAGE_COUPONS },
        { id: 'payment', label: 'درگاه‌ها', icon: WalletCards, perm: AdminPermission.MANAGE_PAYMENT },
        { id: 'shipping', label: 'روش‌های ارسال', icon: Truck, perm: AdminPermission.MANAGE_SHIPPING },
      ].filter(item => hasPermission(item.perm))
    },
    {
      id: 'crm', label: 'ارتباطات', icon: MessageSquare,
      items: [
        { id: 'users', label: 'مدیریت کاربران', icon: Users, perm: AdminPermission.MANAGE_USERS },
        { id: 'tickets', label: 'تیکت‌ها', icon: MessageSquare, perm: AdminPermission.MANAGE_TICKETS },
        { id: 'moderation', label: 'نظرات و فیلترینگ', icon: FileText, perm: AdminPermission.MANAGE_MODERATION },
      ].filter(item => hasPermission(item.perm))
    },
    {
      id: 'adminSettings', label: 'سیستم', icon: Settings,
      items: [
        { id: 'reports', label: 'گزارشات فروش', icon: PieChart, perm: AdminPermission.VIEW_REPORTS },
        { id: 'admins', label: 'مدیریت ادمین‌ها', icon: UserCog, perm: AdminPermission.MANAGE_ADMINS },
      ].filter(item => hasPermission(item.perm))
    }
  ].filter(group => group.items.length > 0), [user]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'appearance': return <AppearanceManagement />;
      case 'marketing': return <MarketingHub />;
      case 'blog': return <BlogManagement onAdd={() => { setEditingPost(null); setShowBlogModal(true); }} onEdit={(p) => { setEditingPost(p); setShowBlogModal(true); }} />;
      case 'categories': return <CategoryManagement />;
      case 'products': return <ProductManagement onAdd={() => { setEditingProduct(null); setShowProductModal(true); }} onEdit={(p) => { setEditingProduct(p); setShowProductModal(true); }} />;
      case 'attributes': return <AttributeManagement />;
      case 'orders': return <OrderManagement />;
      case 'coupons': return <CouponManagement />;
      case 'payment': return <PaymentManagement />;
      case 'shipping': return <ShippingManagement />;
      case 'users': return <UserManagement />;
      case 'tickets': return <CrmManagement />;
      case 'moderation': return <ModerationManagement />;
      case 'reports': return <Reports />;
      case 'admins': return <AdminManagement />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-50 dark:bg-black flex animate-slide-in overflow-hidden">
      <aside className={`fixed inset-y-0 right-0 z-[2020] w-80 bg-primary dark:bg-[#000015] text-white flex flex-col p-6 border-l border-white/5 transition-transform md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="mb-10 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center text-primary font-black shadow-lg">W</div>
            <h1 className="text-lg font-black tracking-tight">پنل مدیریت</h1>
          </div>
          <button onClick={onClose} className="md:hidden text-white/40"><X size={20}/></button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all mb-4 ${activeTab === 'dashboard' ? 'bg-brand text-primary font-black' : 'text-white/60 hover:bg-white/5'}`}>
            <LayoutDashboard size={20} /> <span className="text-xs">پیشخوان</span>
          </button>
          {navigation.map(group => (
            <div key={group.id} className="space-y-1">
               <button onClick={() => toggleGroup(group.id)} className="w-full flex items-center justify-between p-4 text-white/30 hover:text-white transition-colors">
                  <div className="flex items-center gap-3"><group.icon size={16} /> <span className="text-[9px] font-black uppercase tracking-[2px]">{group.label}</span></div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${expandedGroups.includes(group.id) ? 'rotate-180' : ''}`} />
               </button>
               {expandedGroups.includes(group.id) && (
                 <div className="space-y-1 pr-4 animate-slide-down">
                    {group.items.map(item => (
                      <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all text-[11px] ${activeTab === item.id ? 'bg-white/10 text-brand font-black' : 'text-white/60 hover:bg-white/5 font-bold'}`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${activeTab === item.id ? 'bg-brand' : 'bg-transparent'}`} /> {item.label}
                      </button>
                    ))}
                 </div>
               )}
            </div>
          ))}
        </nav>
        <div className="mt-6 pt-6 border-t border-white/5">
          <button onClick={onClose} className="w-full flex items-center gap-4 p-4 text-red-400 font-black text-xs hover:bg-red-500/10 rounded-2xl transition-all"><LogOut size={20} /> خروج</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-surface dark:bg-[#050510] no-scrollbar">
        {renderContent()}
      </main>

      {showProductModal && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowProductModal(false)} />
          <ProductForm editingProduct={editingProduct} onSave={(p) => { editingProduct ? updateProduct(p) : addProduct(p); setShowProductModal(false); }} onCancel={() => setShowProductModal(false)} />
        </div>
      )}

      {showBlogModal && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowBlogModal(false)} />
          <BlogForm editingPost={editingPost} onSave={(p) => { editingPost ? updateBlogPost(p) : addBlogPost(p); setShowBlogModal(false); }} onCancel={() => setShowBlogModal(false)} />
        </div>
      )}
    </div>
  );
};

export default AdminEntry;
