
import React from 'react';
import { useApp } from '../context/AppContext';
import { Category, Product } from '../types';
import ProductCard from './ProductCard';
import { ArrowRight, LayoutGrid, ChevronLeft, Smartphone, Tablet, Headphones, Watch, Gamepad2 } from 'lucide-react';

const iconMap: any = { Smartphone, Tablet, Headphones, Watch, Gamepad2 };

interface CategoryHubProps {
  category: Category;
  onBack: () => void;
  onProductClick: (p: Product) => void;
  onSubCategoryClick: (sub: string) => void;
}

const CategoryHub: React.FC<CategoryHubProps> = ({ category, onBack, onProductClick, onSubCategoryClick }) => {
  const { products } = useApp();
  const categoryProducts = products.filter(p => p.category === category.title);
  const Icon = iconMap[category.icon] || Smartphone;

  return (
    <div className="animate-slide-in pb-20">
      <header className="mb-14 relative overflow-hidden rounded-[56px] bg-primary dark:bg-[#000038] min-h-[320px] flex flex-col justify-end p-12 md:p-20 text-white shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand/20 blur-[120px] rounded-full -translate-y-1/3 translate-x-1/3" />
         <button onClick={onBack} className="absolute top-10 right-10 bg-white/10 p-3 rounded-2xl hover:bg-brand transition-all">
            <ArrowRight size={24} />
         </button>
         
         <div className="relative z-10">
            <div className="inline-flex items-center gap-3 bg-brand/10 text-brand px-6 py-2.5 rounded-full mb-6 border border-brand/20">
               <Icon size={20} />
               <span className="text-xs font-black uppercase tracking-[4px]">{category.title}</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6">{category.title} لوکس</h1>
            <p className="text-white/60 text-sm md:text-lg font-medium max-w-xl leading-relaxed">
               {category.description || `برترین و لوکس‌ترین مجموعه‌های ${category.title} را در وب‌قاب دنبال کنید. تضمین اصالت و بهترین قیمت بازار.`}
            </p>
         </div>
      </header>

      {/* Sub-Category Circles */}
      <section className="mb-20">
         <div className="flex items-center gap-3 mb-10">
            <LayoutGrid className="text-brand" size={24} />
            <h3 className="text-xl font-black">زیرمجموعه‌ها</h3>
         </div>
         <div className="flex flex-wrap gap-4 md:gap-8">
            {/* Fix: Added optional chaining for subcategories array */}
            {category.subcategories?.map(sub => (
              <button 
                key={sub}
                onClick={() => onSubCategoryClick(sub)}
                className="group flex flex-col items-center gap-4 transition-all hover:-translate-y-2"
              >
                 <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-white/5 rounded-[40px] border border-muted/10 shadow-xl flex items-center justify-center transition-all group-hover:bg-brand group-hover:border-brand">
                    <span className="text-primary dark:text-white font-black text-2xl group-hover:scale-125 group-hover:text-primary transition-all">
                      {sub.charAt(0)}
                    </span>
                 </div>
                 <span className="text-xs font-black group-hover:text-brand transition-colors">{sub}</span>
              </button>
            ))}
         </div>
      </section>

      {/* Product List */}
      <section>
         <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black">تمام محصولات این دسته</h3>
            <span className="bg-muted/10 text-muted px-4 py-1.5 rounded-full text-[10px] font-black">{categoryProducts.length} کالا</span>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categoryProducts.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => onProductClick(p)} />
            ))}
         </div>
      </section>
    </div>
  );
};

export default CategoryHub;
