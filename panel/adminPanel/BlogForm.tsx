
import React, { useState, useEffect } from 'react';
import { 
  FileText, X, Save, Globe, Hash, Clock, Image as ImageIcon, 
  Type, User, Layout, Eye, Search, AlertCircle, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toPersianDigitsGlobal, toPersianDigits } from '../../utils/helpers';
import { BlogPost } from '../../types';
import RichTextEditor from '../../components/RichTextEditor';

interface BlogFormProps {
  editingPost: BlogPost | null;
  onSave: (p: BlogPost) => void;
  onCancel: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ editingPost, onSave, onCancel }) => {
  const { addNotification } = useApp();
  const [tab, setTab] = useState<'content' | 'seo' | 'media'>('content');

  // Logic States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('اخبار تکنولوژی');
  const [tags, setTags] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setSlug(editingPost.slug);
      setExcerpt(editingPost.excerpt);
      setContent(editingPost.content);
      setImage(editingPost.image);
      setAuthor(editingPost.author);
      setCategory(editingPost.category);
      setTags(editingPost.tags?.join(', ') || '');
      setReadTime(editingPost.readTime);
      setStatus(editingPost.status);
    } else {
      setAuthor('مدیریت وب‌قاب');
    }
  }, [editingPost]);

  const handleFinalSave = () => {
    if (!title.trim() || !content.trim()) { 
      addNotification('عنوان و محتوای اصلی مقاله الزامی است.', 'error'); 
      return; 
    }
    
    const postData: BlogPost = {
      id: editingPost?.id || `b${Date.now()}`,
      title: toPersianDigitsGlobal(title),
      slug: slug || title.replace(/\s+/g, '-').toLowerCase(),
      excerpt: toPersianDigitsGlobal(excerpt),
      content: content,
      image,
      author,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      publishDate: editingPost?.publishDate || new Date().toISOString(),
      readTime,
      views: editingPost?.views || 0,
      status
    };
    onSave(postData);
    addNotification('مقاله با موفقیت ذخیره شد.', 'success');
  };

  return (
    <div className="relative w-full max-w-5xl bg-white dark:bg-[#080815] rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-slide-up border border-white/10">
      <header className="p-8 bg-slate-50 dark:bg-white/5 border-b border-muted/10 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black">{editingPost ? 'ویرایش مقاله' : 'نگارش مقاله جدید'}</h3>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Advanced Content Architect v1.0</p>
        </div>
        <button onClick={onCancel} className="p-3 bg-white dark:bg-white/5 rounded-2xl text-muted hover:text-brand"><X size={28}/></button>
      </header>

      <nav className="flex bg-slate-50/50 dark:bg-black/40 border-b border-muted/10 overflow-x-auto no-scrollbar">
        {[
          {id:'content', label:'محتوای متنی', icon:FileText},
          {id:'media', label:'رسانه و آمار', icon:ImageIcon},
          {id:'seo', label:'سئو و متادیتا', icon:Globe}
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setTab(t.id as any)} 
            className={`flex-1 p-6 text-[10px] font-black flex items-center justify-center gap-3 border-b-2 transition-all shrink-0 ${tab === t.id ? 'text-brand border-brand bg-brand/5' : 'text-muted border-transparent'}`}
          >
            <t.icon size={18} /> {t.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
        {tab === 'content' && (
          <div className="space-y-8 animate-slide-in">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest">عنوان اصلی مقاله</label>
                <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="عنوانی جذاب بنویسید..." className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-black text-lg border border-transparent focus:border-brand" />
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest">خلاصه مقاله (Excerpt)</label>
                <textarea value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} placeholder="متنی کوتاه برای جذب کاربر در لیست مقالات..." className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs h-24 resize-none border border-transparent focus:border-brand" />
             </div>
             <div className="space-y-3">
                <RichTextEditor 
                  label="محتوای کامل مقاله" 
                  value={content} 
                  onChange={setContent} 
                  placeholder="داستان خود را در اینجا بنویسید..." 
                />
             </div>
          </div>
        )}

        {tab === 'media' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-slide-in">
             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest">تصویر شاخص (URL)</label>
                   <input value={image} onChange={(e)=>setImage(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-mono text-[10px] border border-transparent focus:border-brand" />
                </div>
                <div className="aspect-video rounded-[32px] overflow-hidden bg-black/10 border-2 border-dashed border-muted/20 relative group">
                   {image ? <img src={image} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex flex-col items-center justify-center text-muted opacity-40"><ImageIcon size={48}/><span className="text-[10px] font-black mt-2">No Preview Available</span></div>}
                </div>
             </div>
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest">نویسنده</label>
                      <input value={author} onChange={(e)=>setAuthor(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-xl outline-none font-bold text-xs" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest">دسته بلاگ</label>
                      <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-xl outline-none font-bold text-xs">
                         <option>اخبار تکنولوژی</option>
                         <option>راهنمای خرید</option>
                         <option>بررسی تخصصی</option>
                         <option>ترفندها و آموزش</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest">زمان مطالعه (دقیقه)</label>
                   <input type="number" value={readTime} onChange={(e)=>setReadTime(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-xl outline-none font-black text-sm" />
                </div>
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-muted/5">
                   <span className="text-xs font-black">وضعیت انتشار</span>
                   <button onClick={()=>setStatus(status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')} className={`w-14 h-7 rounded-full transition-all relative ${status === 'PUBLISHED' ? 'bg-brand' : 'bg-muted/30'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${status === 'PUBLISHED' ? 'right-8' : 'right-1'}`} />
                   </button>
                </div>
             </div>
          </div>
        )}

        {tab === 'seo' && (
          <div className="space-y-8 animate-slide-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest">نامک (Slug)</label>
                   <input value={slug} onChange={(e)=>setSlug(e.target.value)} dir="ltr" className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest">برچسب‌ها (با کاما جدا کنید)</label>
                   <input value={tags} onChange={(e)=>setTags(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs" />
                </div>
             </div>
             <div className="bg-brand/5 p-8 rounded-[32px] border border-brand/20">
                <h4 className="font-black text-sm mb-4 flex items-center gap-3"><Globe size={18} className="text-brand"/> تنظیمات استراتژیک سئو</h4>
                <div className="space-y-4">
                   <input placeholder="عنوان سئو (SEO Title)" className="w-full bg-white dark:bg-black/40 p-4 rounded-xl outline-none font-bold text-xs" />
                   <textarea placeholder="توضیحات سئو (Meta Description)" className="w-full bg-white dark:bg-black/40 p-4 rounded-xl outline-none font-bold text-xs h-24 resize-none" />
                </div>
             </div>
          </div>
        )}
      </div>

      <footer className="p-10 border-t border-muted/10 bg-slate-50 dark:bg-white/5 flex items-center justify-between gap-10">
        <div className="hidden md:flex items-center gap-3 text-green-500 bg-green-500/10 px-6 py-4 rounded-2xl">
           <ShieldCheck size={20} />
           <span className="text-[10px] font-black uppercase">محتوا آماده انتشار است</span>
        </div>
        <button 
          onClick={handleFinalSave} 
          className="flex-1 py-6 bg-brand text-primary rounded-[28px] font-black text-lg shadow-2xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4"
        >
           <Save size={24} /> ثبت و انتشار مقاله در وب‌قاب
        </button>
      </footer>
    </div>
  );
};

export default BlogForm;
