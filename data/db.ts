
import { Product, Category } from '../types';

export const SITE_INFO = {
  name: 'وب‌قاب لوکس',
  phone: '۰۲۱-۱۲۳۴۵۶۷۸',
  address: 'تهران، خیابان ولیعصر، برج دیجیتال',
  socials: { instagram: '@webghab', telegram: '@webghab_support' }
};

export const CATEGORIES: Category[] = [
  { 
    id: 'cat-mobile', 
    title: 'گوشی موبایل', 
    icon: 'Smartphone', 
    children: [
      { id: 'sub-apple', title: 'اپل آیفون', icon: 'Smartphone', children: [] },
      { id: 'sub-samsung', title: 'سامسونگ گلکسی', icon: 'Smartphone', children: [] },
      { id: 'sub-xiaomi', title: 'شیائومی', icon: 'Smartphone', children: [] }
    ]
  },
  { 
    id: 'cat-acc', 
    title: 'لوازم جانبی', 
    icon: 'Headphones', 
    children: [
      { 
        id: 'acc-by-mobile', 
        title: 'بر اساس موبایل', 
        icon: 'Smartphone',
        children: [
          { 
            id: 'acc-samsung', 
            title: 'سامسونگ', 
            icon: 'Smartphone',
            children: [
              { id: 'acc-samsung-a56', title: 'Galaxy A56', icon: 'Smartphone', children: [] },
              { id: 'acc-samsung-a36', title: 'Galaxy A36', icon: 'Smartphone', children: [] },
              { id: 'acc-samsung-s24', title: 'Galaxy S24 Series', icon: 'Smartphone', children: [] }
            ]
          },
          { 
            id: 'acc-iphone', 
            title: 'آیفون', 
            icon: 'Smartphone',
            children: [
              { id: 'acc-iphone-15', title: 'iPhone 15 Series', icon: 'Smartphone', children: [] }
            ]
          }
        ]
      },
      { id: 'acc-case', title: 'قاب و کاور', icon: 'Shield', children: [] },
      { id: 'acc-glass', title: 'محافظ صفحه (گلس)', icon: 'Zap', children: [] }
    ]
  },
  { id: 'cat-watch', title: 'ساعت هوشمند', icon: 'Watch', children: [] },
  { id: 'cat-game', title: 'کنسول بازی', icon: 'Gamepad2', children: [] },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'آیفون ۱۵ پرو مکس',
    nameEn: 'iPhone 15 Pro Max',
    price: 85000000,
    wholesalePrice: 81500000,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    category: 'گوشی موبایل',
    rating: 4.9,
    stock: 5,
    isSpecialOffer: true,
    discountPercentage: 0,
    syncPricing: true,
    variants: [
      { id: 'v1', colorName: 'مشکی تیتانیوم', warrantyName: 'گارانتی ۱۸ ماهه', price: 85000000, wholesalePrice: 81500000, discountPercentage: 2, stock: 3 },
      { id: 'v2', colorName: 'آبی تیتانیوم', warrantyName: 'بیمه طلایی وب‌قاب', price: 87000000, wholesalePrice: 83000000, discountPercentage: 0, stock: 2 }
    ],
    selectedColors: [{name: 'مشکی تیتانیوم', hex: '#1c1c1c'}, {name: 'آبی تیتانیوم', hex: '#4e5b6e'}],
    selectedWarranties: ['گارانتی ۱۸ ماهه', 'بیمه طلایی وب‌قاب'],
    specs: {
      'پردازنده': 'A17 Pro',
      'نمایشگر': '6.7 inch OLED',
      'باتری': '4441 mAh',
      'دوربین': '48MP Main'
    },
    tags: ['iphone', 'apple', 'flagship']
  },
  {
    id: 'p2',
    name: 'سامسونگ گلکسی S24 اولترا',
    nameEn: 'Samsung Galaxy S24 Ultra',
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
    selectedColors: [],
    selectedWarranties: [],
    specs: {
      'پردازنده': 'Snapdragon 8 Gen 3',
      'نمایشگر': '6.8 inch AMOLED',
      'باتری': '5000 mAh',
      'دوربین': '200MP Main'
    },
    tags: ['samsung', 'galaxy', 'android', 'flagship']
  }
];
