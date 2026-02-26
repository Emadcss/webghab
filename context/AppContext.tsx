
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, User, CartItem, Product, Category, Order, Address, BlogPost, AppearanceSettings, PaymentStatus, Brand, ProductColor, SpecTemplate, Ticket, ProductComment, Coupon, ShippingMethod, PaymentMethod, AdminLog, AdminSession, TicketStatus, AdminPermission, OrderStatus, DiscountType, TicketMessage } from '../types';
import { PRODUCTS, CATEGORIES, MOCK_USERS } from '../data/mockData';

const API_URL = '/api';

const INITIAL_APPEARANCE: AppearanceSettings = {
  heroSlides: [
    { id: 'h1', image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=1200', tag: 'NEW', title: 'iPhone 15 Pro', desc: 'تجربه نسل بعدی عملکرد و زیبایی.', link: '#', bgColor: 'bg-primary' }
  ],
  promoBanners: [],
  specialOffer: {
    title: 'شگفت‌انگیز',
    subtitle: 'پیشنهاد ویژه روز',
    campaignTag: 'special',
    productIds: [],
    showTimer: true,
  },
  dynamicSections: [],
  footer: {
    aboutText: 'فروشگاه اینترنتی وب‌قاب، مرجع تخصصی گجت‌های هوشمند و کالاهای دیجیتال لوکس با ضمانت اصالت.',
    copyright: '© ۲۰۲۴ وب‌قاب لوکس. تمامی حقوق محفوظ است.',
    instagram: '@webghab',
    telegram: '@webghab',
    phone: '۰۲۱۱۲۳۴۵۶۷۸',
    email: 'info@webghab.com',
    address: 'تهران، خیابان ولیعصر، برج دیجیتال',
    whatsapp: '989121234567'
  },
  marketing: {
    activePopups: [],
    showSocialProof: true,
  },
  layout: {
    showSpecialOffers: true,
  }
};

interface AppContextType {
  user: User | null;
  products: Product[];
  categories: Category[];
  orders: Order[];
  isLoading: boolean;
  login: (e: string, p: string) => Promise<boolean>;
  register: (n: string, e: string, p: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: any) => Promise<void>;
  addAddress: (addr: Address) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  fetchUserOrders: () => Promise<void>;
  addToCart: (p: Product, variantId?: string) => void;
  cart: CartItem[];
  addNotification: (m: string, t: 'success' | 'error' | 'warning') => void;
  notifications: any[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleWishlist: (productId: string) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, change: number) => void;
  appearance: AppearanceSettings;
  addToComparison: (product: Product) => string | null;
  removeFromComparison: (id: string) => void;
  comparisonList: Product[];
  comments: ProductComment[];
  getSimilarProducts: (product: Product) => Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  tickets: Ticket[];
  allUsers: User[];
  brands: Brand[];
  colorLibrary: ProductColor[];
  warrantyLibrary: string[];
  specTemplates: SpecTemplate[];
  updateBrands: (brands: Brand[]) => void;
  updateColors: (colors: ProductColor[]) => void;
  updateWarranties: (warranties: string[]) => void;
  updateSpecTemplates: (templates: SpecTemplate[]) => void;
  exportDatabase: () => string;
  updateOrder: (order: Order) => void;
  updateUserStatus: (id: string, status: string, role?: UserRole) => void;
  removeNotification: (id: string) => void;
  topUpWallet: (amount: number) => void;
  updateUser: (user: User) => void;
  updateAddress: (addr: Address) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  addTicketMessage: (ticketId: string, msg: TicketMessage) => void;
  addComment: (comment: ProductComment) => void;
  toggleCommentLike: (commentId: string, userId: string, isLike: boolean) => void;
  addCommentReply: (commentId: string, reply: any) => void;
  updateCategories: (cats: Category[]) => void;
  wordFilter: string[];
  updateWordFilter: (words: string[]) => void;
  addBlogPost: (p: BlogPost) => void;
  updateBlogPost: (p: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  blogPosts: BlogPost[];
  createOrder: (addr: Address, total: number, shipping: string, payment: string, status: PaymentStatus) => Promise<string | null>;
  coupons: Coupon[];
  addCoupon: (c: Coupon) => void;
  updateCoupon: (c: Coupon) => void;
  deleteCoupon: (id: string) => void;
  shippingMethods: ShippingMethod[];
  addShippingMethod: (m: ShippingMethod) => void;
  updateShippingMethod: (m: ShippingMethod) => void;
  deleteShippingMethod: (id: string) => void;
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (p: PaymentMethod) => void;
  updatePaymentMethod: (p: PaymentMethod) => void;
  deletePaymentMethod: (id: string) => void;
  adminLogs: AdminLog[];
  adminSessions: AdminSession[];
  updateAdminPermissions: (id: string, perms: AdminPermission[]) => void;
  updateAppearance: (settings: AppearanceSettings) => Promise<void>;
  socialProofs: any[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [brands, setBrands] = useState<Brand[]>([{id: 'b1', name: 'Apple'}, {id: 'b2', name: 'Samsung'}]);
  const [colorLibrary, setColorLibrary] = useState<ProductColor[]>([{name: 'سفید', hex: '#FFFFFF'}, {name: 'مشکی', hex: '#000000'}]);
  const [warrantyLibrary, setWarrantyLibrary] = useState<string[]>(['اصالت و سلامت فیزیکی', 'گارانتی ۱۸ ماهه']);
  const [specTemplates, setSpecTemplates] = useState<SpecTemplate[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [adminSessions, setAdminSessions] = useState<AdminSession[]>([]);
  const [wordFilter, setWordFilter] = useState<string[]>(['فیلتر۱', 'فیلتر۲']);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [socialProofs, setSocialProofs] = useState<any[]>([]);
  const [appearance, setAppearance] = useState<AppearanceSettings>(INITIAL_APPEARANCE);

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const authFetch = async (url: string, options: any = {}) => {
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return res;
    } catch (e) {
      return { ok: false, status: 503, json: async () => ({ error: 'Backend Offline' }) } as any;
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${API_URL}/products`).catch(() => null),
          fetch(`${API_URL}/categories`).catch(() => null)
        ]);

        if (pRes && pRes.ok) setProducts(await pRes.json());
        if (cRes && cRes.ok) setCategories(await cRes.json());

        const token = localStorage.getItem('auth_token');
        if (token) {
          const uRes = await authFetch('/auth/me');
          if (uRes.ok) {
            const userData = await uRes.json();
            setUser({ ...userData, isLoggedIn: true, addresses: userData.addresses || [], wishlist: userData.wishlist || [] });
          }
        }
      } catch (err) {
        console.warn("Init failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('auth_token', data.token);
        setUser({ ...data.user, isLoggedIn: true, addresses: data.user.addresses || [], wishlist: data.user.wishlist || [] });
        addNotification('خوش آمدید', 'success');
        return true;
      } else {
        addNotification(data.error || 'خطا در ورود', 'error');
      }
    } catch (e) {
      const mockUser = MOCK_USERS.find(u => u.email === email);
      if (mockUser) {
        setUser({ ...mockUser, isLoggedIn: true });
        addNotification('ورود شبیه‌سازی شده (بک‌ند آفلاین)', 'warning');
        return true;
      }
      addNotification('سرور در دسترس نیست', 'error');
    }
    return false;
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass })
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('auth_token', data.token);
        setUser({ ...data.user, isLoggedIn: true, addresses: [], wishlist: [] });
        addNotification('حساب شما با موفقیت ساخته شد.', 'success');
        return true;
      } else {
        addNotification(data.error || 'خطا در ثبت‌نام', 'error');
      }
    } catch (e) {
      addNotification('سرور در دسترس نیست', 'error');
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    addNotification('از حساب خود خارج شدید.', 'info' as any);
  };

  const updateUserProfile = async (data: any) => {
    const res = await authFetch('/user/profile', { method: 'PUT', body: JSON.stringify(data) });
    if (res.ok) {
      setUser(await res.json());
      addNotification('پروفایل بروز شد', 'success');
    } else {
      setUser(prev => prev ? { ...prev, ...data } : null);
      addNotification('بروزرسانی محلی انجام شد', 'success');
    }
  };

  const addAddress = async (addr: Address) => {
    const res = await authFetch('/user/addresses', { method: 'POST', body: JSON.stringify(addr) });
    if (res.ok) {
      const newAddr = await res.json();
      setUser(prev => prev ? { ...prev, addresses: [...prev.addresses, newAddr] } : null);
    } else {
      const newAddr = { ...addr, id: `ADDR-${Date.now()}` };
      setUser(prev => prev ? { ...prev, addresses: [...prev.addresses, newAddr] } : null);
    }
  };

  const deleteAddress = async (id: string) => {
    await authFetch(`/user/addresses/${id}`, { method: 'DELETE' });
    setUser(prev => prev ? { ...prev, addresses: prev.addresses.filter(a => a.id !== id) } : null);
  };

  const fetchUserOrders = async () => {
    const res = await authFetch('/user/orders');
    if (res.ok) setOrders(await res.json());
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleWishlist = (productId: string) => {
    if (!user) {
      addNotification('برای استفاده از لیست علاقه‌مندی‌ها وارد شوید.', 'warning');
      return;
    }
    setUser(prev => {
      if (!prev) return null;
      const wishlist = prev.wishlist.includes(productId)
        ? prev.wishlist.filter(id => id !== productId)
        : [...prev.wishlist, productId];
      return { ...prev, wishlist };
    });
  };

  const addToCart = (p: Product, variantId?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id && item.selectedVariantId === variantId);
      if (existing) {
        return prev.map(item => (item.id === p.id && item.selectedVariantId === variantId) 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { ...p, quantity: 1, selectedVariantId: variantId }];
    });
    addNotification('به سبد خرید اضافه شد', 'success');
  };

  const removeFromCart = (variantId: string) => {
    setCart(prev => prev.filter(item => item.selectedVariantId !== variantId));
  };

  const updateQuantity = (variantId: string, change: number) => {
    setCart(prev => prev.map(item => 
      item.selectedVariantId === variantId 
        ? { ...item, quantity: Math.max(1, item.quantity + change) } 
        : item
    ));
  };

  const addToComparison = (product: Product) => {
    if (comparisonList.length >= 4) return "حداکثر ۴ کالا برای مقایسه مجاز است.";
    if (comparisonList.some(p => p.id === product.id)) return "این کالا در لیست مقایسه موجود است.";
    if (comparisonList.length > 0 && comparisonList[0].category !== product.category) return "فقط کالاهای یک دسته‌بندی را می‌توانید مقایسه کنید.";
    setComparisonList([...comparisonList, product]);
    return null;
  };

  const removeFromComparison = (id: string) => {
    setComparisonList(prev => prev.filter(p => p.id !== id));
  };

  const getSimilarProducts = (product: Product) => {
    return products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);
  };

  const createOrder = async (addr: Address, total: number, shipping: string, payment: string, status: PaymentStatus) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user?.id || 'guest',
      userName: user?.name || 'مهمان',
      shippingAddress: addr,
      items: cart.map(i => ({ productId: i.id, productName: i.name, quantity: i.quantity, price: i.price })),
      totalAmount: total,
      shippingMethod: shipping,
      paymentMethod: payment,
      status: OrderStatus.PENDING,
      paymentStatus: status,
      createdAt: new Date().toISOString()
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    addNotification('سفارش با موفقیت ثبت شد', 'success');
    return newOrder.id;
  };

  const addComment = (comment: ProductComment) => setComments(prev => [comment, ...prev]);
  
  const toggleCommentLike = (commentId: string, userId: string, isLike: boolean) => {
    setComments(prev => prev.map(c => {
      if (c.id !== commentId) return c;
      const likedBy = isLike 
        ? (c.likedBy.includes(userId) ? c.likedBy.filter(id => id !== userId) : [...c.likedBy, userId])
        : c.likedBy.filter(id => id !== userId);
      const dislikedBy = !isLike
        ? (c.dislikedBy.includes(userId) ? c.dislikedBy.filter(id => id !== userId) : [...c.dislikedBy, userId])
        : c.dislikedBy.filter(id => id !== userId);
      return { ...c, likedBy, dislikedBy, likes: likedBy.length, dislikes: dislikedBy.length };
    }));
  };

  const addCommentReply = (commentId: string, reply: any) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c));
  };

  const addProduct = (p: Product) => setProducts(prev => [p, ...prev]);
  const updateProduct = (p: Product) => setProducts(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(x => x.id !== id));

  const addBlogPost = (p: BlogPost) => setBlogPosts(prev => [p, ...prev]);
  const updateBlogPost = (p: BlogPost) => setBlogPosts(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteBlogPost = (id: string) => setBlogPosts(prev => prev.filter(x => x.id !== id));

  const addCoupon = (c: Coupon) => setCoupons(prev => [c, ...prev]);
  const updateCoupon = (c: Coupon) => setCoupons(prev => prev.map(x => x.id === c.id ? c : x));
  const deleteCoupon = (id: string) => setCoupons(prev => prev.filter(x => x.id !== id));

  const addShippingMethod = (m: ShippingMethod) => setShippingMethods(prev => [m, ...prev]);
  const updateShippingMethod = (m: ShippingMethod) => setShippingMethods(prev => prev.map(x => x.id === m.id ? m : x));
  const deleteShippingMethod = (id: string) => setShippingMethods(prev => prev.filter(x => x.id !== id));

  const addPaymentMethod = (p: PaymentMethod) => setPaymentMethods(prev => [p, ...prev]);
  const updatePaymentMethod = (p: PaymentMethod) => setPaymentMethods(prev => prev.map(x => x.id === p.id ? p : x));
  const deletePaymentMethod = (id: string) => setPaymentMethods(prev => prev.filter(x => x.id !== id));

  return (
    <AppContext.Provider value={{
      user, products, categories, orders, isLoading, login, register, logout,
      updateUserProfile, addAddress, deleteAddress, fetchUserOrders,
      cart, addToCart,
      addNotification, notifications,
      isDarkMode, toggleDarkMode, toggleWishlist, removeFromCart, updateQuantity,
      appearance, comparisonList, addToComparison, removeFromComparison, comments, getSimilarProducts,
      addProduct, updateProduct, deleteProduct, tickets, allUsers,
      brands, colorLibrary, warrantyLibrary, specTemplates,
      updateBrands: setBrands, updateColors: setColorLibrary, updateWarranties: setWarrantyLibrary, updateSpecTemplates: setSpecTemplates,
      exportDatabase: () => JSON.stringify({ products, categories, brands, colorLibrary, warrantyLibrary, specTemplates, coupons, shippingMethods, paymentMethods }, null, 2),
      updateOrder: (order) => setOrders(prev => prev.map(o => o.id === order.id ? order : o)),
      updateUserStatus: (id, status, role) => setAllUsers(prev => prev.map(u => u.id === id ? { ...u, status: status as any, role: role || u.role } : u)),
      removeNotification,
      topUpWallet: (amount) => setUser(prev => prev ? { ...prev, walletBalance: prev.walletBalance + amount } : null),
      updateUser: (u) => setUser(u),
      updateAddress: (addr) => setUser(prev => prev ? { ...prev, addresses: prev.addresses.map(a => a.id === addr.id ? addr : a) } : null),
      updateTicketStatus: (id, status) => setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t)),
      addTicketMessage: (id, msg) => setTickets(prev => prev.map(t => t.id === id ? { ...t, messages: [...t.messages, msg] } : t)),
      addComment, toggleCommentLike, addCommentReply,
      updateCategories: setCategories,
      wordFilter, updateWordFilter: setWordFilter,
      addBlogPost, updateBlogPost, deleteBlogPost, blogPosts,
      createOrder,
      coupons, addCoupon, updateCoupon, deleteCoupon,
      shippingMethods, addShippingMethod, updateShippingMethod, deleteShippingMethod,
      paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod,
      adminLogs, adminSessions,
      updateAdminPermissions: (id, perms) => setAllUsers(prev => prev.map(u => u.id === id ? { ...u, permissions: perms } : u)),
      updateAppearance: async (s) => setAppearance(s),
      socialProofs
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const c = useContext(AppContext);
  if (!c) throw new Error("Context error");
  return c;
};
