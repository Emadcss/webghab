
import { Product, Category, User, UserRole, AdminPermission } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'USR-1001',
    name: 'مدیر کل سیستم',
    firstName: 'امیر',
    lastName: 'مدیری',
    email: 'admin@webghab.com',
    role: UserRole.ADMIN,
    permissions: [AdminPermission.SYSTEM_ROOT],
    isLoggedIn: false,
    phone: '09121111111',
    nationalId: '0012345678',
    status: 'ACTIVE',
    wishlist: [],
    walletBalance: 1500000,
    walletTransactions: [],
    addresses: [
      {
        id: 'ADDR-1',
        title: 'دفتر مرکزی وب‌قاب',
        receiverName: 'امیر مدیری',
        phone: '02122334455',
        province: 'تهران',
        city: 'تهران',
        fullAddress: 'خیابان ولیعصر، برج دیجیتال، طبقه ۱۰، واحد ۱۰۰',
        postalCode: '1234567890',
        plaque: '10',
        unit: '100',
        isDefault: true
      }
    ]
  },
  {
    id: 'USR-1003',
    name: 'مشتری تست',
    firstName: 'سارا',
    lastName: 'کاظمی',
    email: 'user@webghab.com',
    role: UserRole.CUSTOMER,
    isLoggedIn: false,
    phone: '09353333333',
    nationalId: '0033445566',
    status: 'ACTIVE',
    wishlist: ['p2'],
    walletBalance: 500000,
    walletTransactions: [],
    addresses: []
  }
];

export const CATEGORIES: Category[] = [
  { 
    id: '1', 
    title: 'گوشی موبایل', 
    icon: 'Smartphone', 
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
    children: [
      { 
        id: '1-1', 
        title: 'اپل (iPhone)', 
        icon: 'Smartphone',
        children: [
          { id: '1-1-1', title: 'iPhone 15 Series', icon: 'Smartphone' },
          { id: '1-1-2', title: 'iPhone 14 Series', icon: 'Smartphone' },
          { id: '1-1-3', title: 'iPhone SE', icon: 'Smartphone' }
        ]
      },
      { 
        id: '1-2', 
        title: 'سامسونگ (Galaxy)', 
        icon: 'Smartphone',
        children: [
          { id: '1-2-1', title: 'سری S', icon: 'Smartphone' },
          { id: '1-2-2', title: 'سری A', icon: 'Smartphone' },
          { id: '1-2-3', title: 'سری Z (تاشو)', icon: 'Smartphone' }
        ]
      }
    ]
  },
  { 
    id: '2', 
    title: 'لوازم جانبی', 
    icon: 'Headphones', 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    children: [
      { 
        id: '2-1', 
        title: 'محافظت', 
        icon: 'Shield',
        children: [
          { id: '2-1-1', title: 'قاب و کاور', icon: 'Shield' },
          { id: '2-1-2', title: 'محافظ صفحه', icon: 'Zap' }
        ]
      },
      { 
        id: '2-2', 
        title: 'صوتی', 
        icon: 'Headphones',
        children: [
          { id: '2-2-1', title: 'هدفون بی سیم', icon: 'Headphones' },
          { id: '2-2-2', title: 'اسپیکر بلوتوثی', icon: 'Speaker' }
        ]
      }
    ]
  },
  { 
    id: '3', 
    title: 'گجت‌های پوشیدنی', 
    icon: 'Watch', 
    image: 'https://images.unsplash.com/photo-1544117518-2b46abc899ec?auto=format&fit=crop&q=80&w=600',
    children: [
      { id: '3-1', title: 'ساعت هوشمند', icon: 'Watch' },
      { id: '3-2', title: 'مچ‌بند سلامتی', icon: 'Activity' }
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max - Titanium',
    nameEn: 'Apple iPhone 15 Pro Max',
    price: 85000000,
    wholesalePrice: 81500000,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    category: 'گوشی موبایل',
    rating: 4.9,
    stock: 5,
    isSpecialOffer: true,
    discountPercentage: 2,
    syncPricing: true,
    variants: [],
    selectedColors: [{name: 'تیتانیوم نچرال', hex: '#BEBBB4'}],
    selectedWarranties: ['گارانتی ۱۸ ماهه پارس استل'],
    tags: ['iphone', 'apple', 'smartphone', 'premium'],
    specs: { 'نمایشگر': '6.7 inch OLED', 'پردازنده': 'A17 Pro', 'دوربین': '48MP' }
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra',
    nameEn: 'Samsung Galaxy S24 Ultra 5G',
    price: 74000000,
    wholesalePrice: 71000000,
    image: 'https://images.unsplash.com/photo-1707151021464-91361c40212f?auto=format&fit=crop&q=80&w=800',
    category: 'گوشی موبایل',
    rating: 4.8,
    stock: 8,
    isSpecialOffer: true,
    discountPercentage: 0,
    syncPricing: true,
    variants: [],
    selectedColors: [{name: 'تیتانیوم خاکستری', hex: '#444444'}],
    selectedWarranties: ['گارانتی ۱۸ ماهه مایکروتل'],
    tags: ['samsung', 'galaxy', 'smartphone', 'premium'],
    specs: { 'نمایشگر': '6.8 inch Dynamic AMOLED', 'پردازنده': 'Snapdragon 8 Gen 3' }
  },
  {
    id: 'p3',
    name: 'AirPods Pro (2nd Gen)',
    nameEn: 'Apple AirPods Pro 2 with USB-C',
    price: 12500000,
    wholesalePrice: 10800000,
    image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&q=80&w=800',
    category: 'لوازم جانبی',
    rating: 4.7,
    stock: 25,
    isSpecialOffer: true,
    discountPercentage: 5,
    syncPricing: true,
    variants: [],
    selectedColors: [{name: 'سفید', hex: '#FFFFFF'}],
    selectedWarranties: ['اصالت و سلامت فیزیکی'],
    tags: ['apple', 'airpods', 'audio', 'headphones']
  }
];
