
import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, FileText, Eye, Clock, User, Hash } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toPersianDigits, toPersianDigitsGlobal } from '../../utils/helpers';
import { BlogPost } from '../../types';

interface BlogManagementProps {
  onAdd: () => void;
  onEdit: (p: BlogPost) => void;
}

const BlogManagement: React.FC<BlogManagementProps> = ({ onAdd, onEdit }) => {
  const { blogPosts, deleteBlogPost } = useApp();
  const [q, setQ] = useState('');

  const filtered = blogPosts.filter(p => p.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-8 animate-slide-in">
       <header className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black">تحریریه محتوا و بلاگ</h2>
            <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">WebGhab Content Studio</p>
          </div>
          <button onClick={onAdd} className="bg-brand text-primary px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
             <Plus size={20} /> ایجاد مقاله جدید
          </button>
       </header>

       <div className="relative max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            placeholder="جستجوی در عناوین مقالات..."
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            className="w-full bg-white dark:bg-[#000028] p-4 pr-12 rounded-2xl outline-none font-bold border border-muted/10 shadow-sm"
          />
       </div>

       <div className="bg-white dark:bg-[#000028] rounded-[40px] shadow-xl overflow-hidden border border-muted/10">
          <table className="w-full text-right">
             <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black text-muted uppercase tracking-widest">
                <tr><th className="p-8">عنوان مقاله</th><th className="p-8">دسته‌بندی</th><th className="p-8">آمار بازدید</th><th className="p-8">وضعیت</th><th className="p-8 text-center">عملیات</th></tr>
             </thead>
             <tbody className="divide-y divide-muted/10">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                     <td className="p-8 flex items-center gap-4">
                        <div className="w-16 h-12 rounded-xl overflow-hidden shadow-sm shrink-0">
                           <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                           <span className="font-black text-xs block line-clamp-1">{p.title}</span>
                           <div className="flex items-center gap-2 mt-1 opacity-50">
                              <User size={10} /> <span className="text-[8px] font-bold">{p.author}</span>
                              <Clock size={10} /> <span className="text-[8px] font-bold">{toPersianDigitsGlobal(new Date(p.publishDate).toLocaleDateString('fa-IR'))}</span>
                           </div>
                        </div>
                     </td>
                     <td className="p-8 text-xs text-brand font-black">{p.category}</td>
                     <td className="p-8">
                        <div className="flex items-center gap-2">
                           <Eye size={14} className="text-muted" />
                           <span className="font-bold text-xs">{toPersianDigits(p.views)}</span>
                        </div>
                     </td>
                     <td className="p-8">
                        <span className={`px-3 py-1 rounded-lg text-[8px] font-black ${p.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'}`}>
                           {p.status === 'PUBLISHED' ? 'منتشر شده' : 'پیش‌نویس'}
                        </span>
                     </td>
                     <td className="p-8 flex justify-center gap-3">
                        <button onClick={() => onEdit(p)} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit3 size={18} /></button>
                        <button onClick={() => deleteBlogPost(p.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
          {filtered.length === 0 && (
             <div className="p-20 text-center opacity-30 flex flex-col items-center gap-4">
                <FileText size={64} strokeWidth={1}/>
                <p className="font-black italic">هنوز هیچ مقاله‌ای در بلاگ ثبت نشده است.</p>
             </div>
          )}
       </div>
    </div>
  );
};

export default BlogManagement;
