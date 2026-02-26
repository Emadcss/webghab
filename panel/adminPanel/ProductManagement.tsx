
import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Box } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice, toPersianDigits } from '../../utils/helpers';
import { Product } from '../../types';

interface ProductManagementProps {
  onAdd: () => void;
  onEdit: (p: Product) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ onAdd, onEdit }) => {
  const { products, deleteProduct } = useApp();
  const [q, setQ] = useState('');

  const filtered = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-8 animate-slide-in">
       <header className="flex justify-between items-center">
          <h2 className="text-3xl font-black">مدیریت محصولات</h2>
          <button onClick={onAdd} className="bg-brand text-primary px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl">
             <Plus size={20} /> محصول جدید
          </button>
       </header>

       <div className="relative max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            placeholder="جستجوی کالا..."
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            className="w-full bg-white dark:bg-[#000028] p-4 pr-12 rounded-2xl outline-none font-bold border border-muted/10"
          />
       </div>

       <div className="bg-white dark:bg-[#000028] rounded-[40px] shadow-xl overflow-hidden border border-muted/10">
          <table className="w-full text-right">
             <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black text-muted uppercase tracking-widest">
                <tr><th className="p-8">محصول</th><th className="p-8">دسته</th><th className="p-8">قیمت پایه</th><th className="p-8">موجودی</th><th className="p-8 text-center">عملیات</th></tr>
             </thead>
             <tbody className="divide-y divide-muted/10">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                     <td className="p-8 flex items-center gap-4">
                        <img src={p.image} className="w-12 h-12 rounded-xl object-cover" />
                        <span className="font-black text-xs">{p.name}</span>
                     </td>
                     <td className="p-8 text-xs text-muted font-bold">{p.category}</td>
                     <td className="p-8 font-black text-brand text-xs">{formatPrice(p.price)}</td>
                     <td className="p-8 text-xs font-bold">{toPersianDigits(p.stock)} عدد</td>
                     <td className="p-8 flex justify-center gap-3">
                        <button onClick={() => onEdit(p)} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl"><Edit3 size={18} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl"><Trash2 size={18} /></button>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default ProductManagement;
