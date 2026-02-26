
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN'
}

export enum AdminPermission {
  MANAGE_PRODUCTS = 'MANAGE_PRODUCTS',
  MANAGE_CATEGORIES = 'MANAGE_CATEGORIES',
  MANAGE_ORDERS = 'MANAGE_ORDERS',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_TICKETS = 'MANAGE_TICKETS',
  MANAGE_COUPONS = 'MANAGE_COUPONS',
  MANAGE_SHIPPING = 'MANAGE_SHIPPING',
  MANAGE_PAYMENT = 'MANAGE_PAYMENT',
  MANAGE_MODERATION = 'MANAGE_MODERATION',
  VIEW_REPORTS = 'VIEW_REPORTS',
  MANAGE_ADMINS = 'MANAGE_ADMINS',
  MANAGE_APPEARANCE = 'MANAGE_APPEARANCE',
  MANAGE_MARKETING = 'MANAGE_MARKETING',
  MANAGE_BLOG = 'MANAGE_BLOG',
  SYSTEM_ROOT = 'SYSTEM_ROOT'
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  views: number;
  status: 'PUBLISHED' | 'DRAFT';
  metaTitle?: string;
  metaDescription?: string;
}

export interface BlogCategory {
  id: string;
  title: string;
  slug: string;
}

// ... (سایر اینترفیس‌های قبلی بدون تغییر باقی می‌مانند)
export interface PromoBanner {
  id: string;
  title: string;
  image: string;
  link: string;
  label: string;
}

export interface AppearanceSettings {
  heroSlides: HeroSlide[];
  promoBanners: PromoBanner[];
  specialOffer: {
    title: string;
    subtitle: string;
    campaignTag: string;
    productIds: string[];
    showTimer: boolean;
  };
  dynamicSections: any[];
  footer: any;
  marketing: {
    activePopups: MarketingCampaign[];
    showSocialProof: boolean;
  };
  layout: {
    showSpecialOffers: boolean;
  };
}

export interface HeroSlide {
  id: string;
  image: string;
  tag: string;
  title: string;
  desc: string;
  link: string;
  bgColor: string;
}

export interface Address {
  id: string;
  title: string;
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  fullAddress: string;
  postalCode: string;
  plaque?: string;
  unit?: string;
  isDefault: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariantId?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  REFUNDED = 'REFUNDED'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  messages: TicketMessage[];
}

export interface MarketingCampaign {
  id: string;
  type: 'POPUP' | 'BANNER' | 'EMAIL';
  title: string;
  content: string;
  link: string;
  isActive: boolean;
}

export interface ChangeLogEntry {
  version: string;
  timestamp: string;
  changes: string[];
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  timestamp: string;
}

export interface HomeSection {
  id: string;
  type: string;
  title: string;
  config: any;
}

export interface ProductVariant {
  id: string;
  colorName: string;
  warrantyName: string;
  price: number;
  wholesalePrice: number;
  discountPercentage: number;
  stock: number;
}

export interface User { 
  id: string; 
  name: string; 
  firstName?: string; 
  lastName?: string; 
  email: string; 
  role: UserRole; 
  permissions?: AdminPermission[]; 
  isLoggedIn: boolean; 
  phone?: string; 
  nationalId?: string; 
  addresses: Address[]; 
  wishlist: string[]; 
  walletBalance: number; 
  walletTransactions: WalletTransaction[]; 
  status: 'ACTIVE' | 'BLOCKED'; 
}

export interface Product { 
  id: string; 
  name: string; 
  nameEn?: string; 
  brandId?: string; 
  category: string; 
  image: string; 
  rating: number; 
  price: number; 
  wholesalePrice: number; 
  discountPercentage: number; 
  stock: number; 
  syncPricing: boolean; 
  variants: ProductVariant[]; 
  selectedColors: { name: string; hex: string }[]; 
  selectedWarranties: string[]; 
  specs?: Record<string, string>; 
  review?: { text: string; pros: string[]; cons: string[] }; 
  isSpecialOffer?: boolean; 
  tags: string[]; 
  slug?: string; 
  metaTitle?: string; 
  metaDescription?: string; 
}

export interface Category { id: string; title: string; icon: string; image?: string; description?: string; children?: Category[]; subcategories?: string[]; }
export interface Order { id: string; userId: string; userName: string; shippingAddress: Address; items: any[]; totalAmount: number; shippingMethod: string; paymentMethod: string; status: OrderStatus; paymentStatus: PaymentStatus; createdAt: string; }
export interface ProductComment { id: string; productId: string; userId: string; userName: string; text: string; rating: number; likes: number; dislikes: number; isBuyer: boolean; replies: any[]; timestamp: string; likedBy: string[]; dislikedBy: string[]; }
export interface Coupon { id: string; code: string; discountType: DiscountType; discountValue: number; minOrderAmount: number; status: 'ACTIVE' | 'DISABLED' | 'EXPIRED'; usedCount: number; maxDiscountAmount?: number; }
export enum DiscountType { PERCENTAGE = 'PERCENTAGE', FIXED = 'FIXED' }
export interface Brand { id: string; name: string; }
export interface SpecTemplate { categoryId: string; keys: string[]; }
export interface ProductColor { name: string; hex: string; }
export interface AdminLog { id: string; adminId: string; adminName: string; module: string; action: string; details: string; timestamp: string; }
export interface AdminSession { id: string; adminId: string; adminName: string; loginAt: string; logoutAt?: string; durationMinutes?: number; status: 'ONLINE' | 'OFFLINE'; }
export interface ShippingMethod { id: string; name: string; cost: number; estimatedTime: string; icon: string; isActive: boolean; description?: string; apiEnabled: boolean; apiConfig?: any; }
export interface PaymentMethod { id: string; name: string; description: string; icon: string; isActive: boolean; type: 'ONLINE' | 'OFFLINE' | 'WALLET'; apiEnabled: boolean; apiConfig?: any; }
