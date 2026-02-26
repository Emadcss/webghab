
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BlogPost } from '../types';
import { toPersianDigitsGlobal, toPersianDigits } from '../utils/helpers';
// Added FileText to the imports below
import { Search, Clock, User, ChevronLeft, Calendar, FileText } from 'lucide-react';

interface BlogViewProps {
  onPostClick: (post: BlogPost) => void;
}

const BlogView: React.FC<BlogViewProps> = ({ onPostClick }) => {
  const { blogPosts } = useApp();
  const [q, setQ] = useState('');

  const filtered = blogPosts.filter(p => p.status === 'PUBLISHED' && (p.title.includes(q) || p.category.includes(q)));

  return (
    <div className="animate-slide-in pb-20">
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-6">مجله تخصصی وب‌قاب</h1>
        <p className="text-sm md:text-lg text-muted font-medium max-w-2xl mx-auto leading-relaxed">بررسی هوشمندانه جدیدترین گجت‌ها، راهنمای خرید تخصصی و اخبار روز دنیای تکنولوژی در وب‌قاب.</p>
        
        <div className="mt-12 max-w-xl mx-auto relative group">
           <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand transition-colors" size={20} />
           <input 
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="جستجوی موضوعات و مقالات..."
            className="w-full bg-white dark:bg-white/5 p-5 pr-14 rounded-[28px] border border-muted/10 outline-none font-bold text-sm shadow-xl focus:border-brand transition-all"
           />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map(post => (
          <div key={post.id} onClick={() => onPostClick(post)} className="group cursor-pointer bg-white dark:bg-[#111122] rounded-[40px] overflow-hidden border border-muted/5 shadow-lg hover:shadow-2xl transition-all">
             <div className="aspect-[16/10] overflow-hidden relative">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-5 right-5 bg-brand text-primary text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg">
                   {post.category}
                </div>
             </div>
             <div className="p-8">
                <div className="flex items-center gap-4 text-[9px] font-black text-muted uppercase tracking-widest mb-4">
                   <div className="flex items-center gap-1.5"><Calendar size={14} className="text-brand"/> {toPersianDigitsGlobal(new Date(post.publishDate).toLocaleDateString('fa-IR'))}</div>
                   <div className="flex items-center gap-1.5"><Clock size={14} className="text-brand"/> {toPersianDigits(post.readTime)} دقیقه</div>
                </div>
                <h3 className="text-lg font-black leading-tight group-hover:text-brand transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-xs text-muted font-medium mt-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                <div className="mt-8 pt-6 border-t border-muted/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-black text-[10px]">{post.author.charAt(0)}</div>
                      <span className="text-[10px] font-black">{post.author}</span>
                   </div>
                   <button className="text-[10px] font-black flex items-center gap-1 hover:translate-x-[-4px] transition-transform">مطالعه مقاله <ChevronLeft size={16}/></button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-40 text-center opacity-30">
           {/* Fixed: FileText is now imported from lucide-react */}
           <FileText size={80} strokeWidth={1} className="mx-auto mb-6" />
           <p className="text-xl font-black italic">مقاله‌ای با این مشخصات یافت نشد.</p>
        </div>
      )}
    </div>
  );
};

export default BlogView;
