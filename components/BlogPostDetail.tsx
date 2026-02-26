
import React, { useEffect } from 'react';
import { BlogPost } from '../types';
import { toPersianDigitsGlobal, toPersianDigits } from '../utils/helpers';
import { ArrowRight, Clock, Calendar, User, Share2, MessageCircle, Bookmark } from 'lucide-react';

const BlogPostDetail: React.FC<{ post: BlogPost; onBack: () => void }> = ({ post, onBack }) => {
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]);

  return (
    <div className="animate-slide-in pb-20">
      <button onClick={onBack} className="flex items-center gap-2 text-muted font-black text-sm hover:text-brand transition-colors mb-12 group">
        <div className="bg-white dark:bg-white/5 p-2 rounded-xl shadow-sm group-hover:bg-brand group-hover:text-primary transition-all"><ArrowRight size={20} /></div>
        بازگشت به مجله
      </button>

      <article className="max-w-4xl mx-auto">
         <header className="mb-12">
            <div className="inline-flex items-center gap-3 bg-brand/10 text-brand px-6 py-2 rounded-full mb-8 font-black text-xs uppercase tracking-widest">
               {post.category}
            </div>
            <h1 className="text-3xl md:text-6xl font-black leading-tight md:leading-tight mb-10">{post.title}</h1>
            
            <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-muted/10">
               <div className="flex items-center gap-10">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">{post.author.charAt(0)}</div>
                     <div><p className="text-[10px] font-black text-muted uppercase tracking-widest">نویسنده</p><p className="text-xs font-black mt-1">{post.author}</p></div>
                  </div>
                  <div className="h-10 w-px bg-muted/10 hidden md:block" />
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-brand"><Calendar size={20}/></div>
                     <div><p className="text-[10px] font-black text-muted uppercase tracking-widest">انتشار</p><p className="text-xs font-black mt-1">{toPersianDigitsGlobal(new Date(post.publishDate).toLocaleDateString('fa-IR'))}</p></div>
                  </div>
                  <div className="h-10 w-px bg-muted/10 hidden md:block" />
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-brand"><Clock size={20}/></div>
                     <div><p className="text-[10px] font-black text-muted uppercase tracking-widest">مطالعه</p><p className="text-xs font-black mt-1">{toPersianDigits(post.readTime)} دقیقه</p></div>
                  </div>
               </div>
               <div className="flex gap-3">
                  <button className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl hover:bg-brand transition-all shadow-sm"><Share2 size={18}/></button>
                  <button className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl hover:bg-brand transition-all shadow-sm"><Bookmark size={18}/></button>
               </div>
            </div>
         </header>

         <div className="aspect-[21/9] rounded-[56px] overflow-hidden mb-16 shadow-2xl border border-white/10">
            <img src={post.image} className="w-full h-full object-cover" />
         </div>

         <div className="prose prose-invert max-w-none">
            <p className="text-lg md:text-xl font-bold leading-[2.2] text-primary/80 dark:text-white/80 text-justify mb-10 bg-slate-50 dark:bg-white/5 p-10 rounded-[48px] border-r-4 border-brand">
               {post.excerpt}
            </p>
            <div className="text-sm md:text-base font-medium leading-[2.5] text-primary/70 dark:text-white/70 text-justify space-y-8">
               {/* در یک سیستم واقعی اینجا محتوای HTML از یک ادیتور قرار می‌گیرد */}
               <p>{post.content}</p>
               <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
               
               <div className="bg-[#000038] p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden my-16">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><MessageCircle size={120} /></div>
                  <h3 className="text-2xl font-black mb-6">نظر شما چیست؟</h3>
                  <p className="text-sm opacity-60 mb-10 leading-relaxed">دیدگاه‌های شما به ما کمک می‌کند تا محتوای بهتری برای شما آماده کنیم. تجربیات خود را در مورد این موضوع با سایر کاربران وب‌قاب به اشتراک بگذارید.</p>
                  <button className="bg-brand text-primary px-10 py-5 rounded-[24px] font-black text-sm shadow-xl hover:scale-105 transition-all">ثبت دیدگاه تخصصی</button>
               </div>
            </div>
         </div>

         <footer className="mt-20 pt-10 border-t border-muted/10 flex flex-wrap gap-3">
            {post.tags.map(tag => (
              <span key={tag} className="px-5 py-2 bg-slate-100 dark:bg-white/5 rounded-xl text-[10px] font-black text-muted hover:text-brand transition-colors cursor-pointer">#{tag}</span>
            ))}
         </footer>
      </article>
    </div>
  );
};

export default BlogPostDetail;
