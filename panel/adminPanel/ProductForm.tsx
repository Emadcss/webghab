
import React, { useState, useEffect } from 'react';
import { 
  Box, Percent, Palette, ClipboardList, MessageSquare, X, Save, Trash2, Plus, 
  AlertCircle, CheckCircle2, Globe, Search, Hash, DollarSign, ShieldCheck, Zap,
  Link as LinkIcon, Type, FileText, Languages
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatInputNumber, cleanPrice, toPersianDigitsGlobal, toPersianDigits } from '../../utils/helpers';
import { Product, ProductVariant, ProductColor } from '../../types';
import RichTextEditor from '../../components/RichTextEditor';

interface ProductFormProps {
  editingProduct: Product | null;
  onSave: (p: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ editingProduct, onSave, onCancel }) => {
  const { categories, brands, colorLibrary, warrantyLibrary, specTemplates, addNotification } = useApp();
  const [modalTab, setModalTab] = useState<'basic' | 'price' | 'variants' | 'specs' | 'review' | 'seo'>('basic');

  // Logic States
  const [pName, setPName] = useState('');
  const [pNameEn, setPNameEn] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pImage, setPImage] = useState('');
  const [pTags, setPTags] = useState('');
  const [pPrice, setPPrice] = useState('0');
  const [pWholesale, setPWholesale] = useState('0');
  const [pDiscount, setPDiscount] = useState(0);
  const [pStock, setPStock] = useState(0);
  const [pSync, setPSync] = useState(true);
  const [pVariants, setPVariants] = useState<ProductVariant[]>([]);
  const [newVColor, setNewVColor] = useState(colorLibrary[0]?.name || '');
  const [newVWarranty, setNewVWarranty] = useState(warrantyLibrary[0] || '');
  const [pSpecs, setPSpecs] = useState<Record<string, string>>({});
  const [reviewText, setReviewText] = useState('');
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');
  
  const [pSlug, setPSlug] = useState('');
  const [pMetaTitle, setPMetaTitle] = useState('');
  const [pMetaDescription, setPMetaDescription] = useState('');
  const [pNameEnError, setPNameEnError] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setPName(editingProduct.name);
      setPNameEn(editingProduct.nameEn || '');
      setPCategory(editingProduct.category);
      setPBrand(editingProduct.brandId || '');
      setPImage(editingProduct.image);
      setPTags(editingProduct.tags?.join(', ') || '');
      setPSync(editingProduct.syncPricing);
      setPPrice(formatInputNumber(editingProduct.price));
      setPWholesale(formatInputNumber(editingProduct.wholesalePrice));
      setPDiscount(editingProduct.discountPercentage || 0);
      setPStock(editingProduct.stock);
      setPVariants(editingProduct.variants || []);
      setPSpecs(editingProduct.specs || {});
      setReviewText(editingProduct.review?.text || '');
      setPros(editingProduct.review?.pros || []);
      setCons(editingProduct.review?.cons || []);
      setPSlug(editingProduct.slug || '');
      setPMetaTitle(editingProduct.metaTitle || '');
      setPMetaDescription(editingProduct.metaDescription || '');
    } else {
      setPCategory(categories[0]?.title || '');
      setPBrand(brands[0]?.id || '');
    }
  }, [editingProduct, categories, brands]);

  useEffect(() => {
    const hasPersian = /[\u0600-\u06FF]/.test(pNameEn);
    if (hasPersian) {
      setPNameEnError('خطا: نام انگلیسی نباید شامل حروف فارسی باشد.');
    } else {
      setPNameEnError('');
    }
  }, [pNameEn]);

  useEffect(() => {
    if (!editingProduct) {
      const selectedCategory = categories.find(c => c.title === pCategory);
      const template = specTemplates.find(s => s.categoryId === selectedCategory?.id);
      if (template) {
        const newSpecs: Record<string, string> = {};
        template.keys.forEach(k => newSpecs[k] = '');
        setPSpecs(newSpecs);
      }
    }
  }, [pCategory, specTemplates, categories, editingProduct]);

  useEffect(() => {
    if (!pSlug && pName) {
      setPSlug(pName.trim().replace(/\s+/g, '-').toLowerCase());
    }
  }, [pName, pSlug]);

  const addVariantRow = () => {
    if (!newVColor || !newVWarranty) return;
    if (pVariants.some(v => v.colorName === newVColor && v.warrantyName === newVWarranty)) {
      addNotification('این ترکیب قبلاً وجود دارد.', 'error');
      return;
    }
    const basePrice = cleanPrice(pPrice);
    setPVariants([...pVariants, {
      id: `v-${Date.now()}`, colorName: newVColor, warrantyName: newVWarranty,
      price: basePrice, wholesalePrice: cleanPrice(pWholesale), 
      discountPercentage: pDiscount, stock: 1
    }]);
  };

  const handleUpdateVariant = (id: string, field: keyof ProductVariant, val: any) => {
    setPVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: val } : v));
  };

  const handleFinalSave = () => {
    if (!pName.trim()) { addNotification('نام محصول الزامی است.', 'error'); return; }
    if (pNameEnError) { addNotification('لطفاً خطای نام انگلیسی را برطرف کنید.', 'error'); return; }
    
    const productData: Product = {
      id: editingProduct?.id || `p${Date.now()}`,
      name: toPersianDigitsGlobal(pName),
      nameEn: pNameEn.trim(),
      category: pCategory, brandId: pBrand, image: pImage,
      price: cleanPrice(pPrice), wholesalePrice: cleanPrice(pWholesale),
      discountPercentage: pDiscount, stock: pStock, syncPricing: pSync,
      variants: pVariants,
      selectedColors: colorLibrary.filter(c => pVariants.some(v => v.colorName === c.name)),
      selectedWarranties: Array.from(new Set(pVariants.map(v => v.warrantyName))),
      specs: pSpecs, review: { text: reviewText, pros, cons },
      tags: pTags.split(',').map(t => t.trim()).filter(Boolean),
      slug: pSlug || pName.replace(/\s+/g, '-'),
      metaTitle: pMetaTitle || pName,
      metaDescription: pMetaDescription,
      rating: editingProduct?.rating || 5.0
    };
    onSave(productData);
    addNotification('ذخیره‌سازی با موفقیت انجام شد.', 'success');
  };

  return (
    <div className="relative w-full max-w-6xl bg-white dark:bg-[#080815] rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-slide-up border border-white/10">
      <header className="p-8 bg-slate-50 dark:bg-white/5 border-b border-muted/10 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black">{editingProduct ? 'ویرایش تخصصی' : 'تعریف کالا'}</h3>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Enterprise Inventory Suite v3.5</p>
        </div>
        <button onClick={onCancel} className="p-3 bg-white dark:bg-white/5 rounded-2xl text-muted hover:text-brand"><X size={28}/></button>
      </header>

      <nav className="flex bg-slate-50/50 dark:bg-black/40 border-b border-muted/10 overflow-x-auto no-scrollbar">
        {[
          {id:'basic', label:'اطلاعات پایه', icon:Box},
          {id:'price', label:'تنظیمات فروش', icon:DollarSign},
          {id:'variants', label:'ماتریس ترکیبات', icon:Palette},
          {id:'specs', label:'مشخصات فنی', icon:ClipboardList},
          {id:'review', label:'بررسی تخصصی', icon:MessageSquare},
          {id:'seo', label:'سئو و مارکتینگ', icon:Globe}
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setModalTab(t.id as any)} 
            className={`flex-1 p-6 text-[10px] font-black flex items-center justify-center gap-3 border-b-2 transition-all shrink-0 ${modalTab === t.id ? 'text-brand border-brand bg-brand/5' : 'text-muted border-transparent'}`}
          >
            <t.icon size={18} /> {t.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
        {modalTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-in">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest">نام کالا (فارسی)</label>
                <input value={pName} onChange={(e)=>setPName(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-transparent focus:border-brand" />
             </div>
             <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                   Model Name (English) <Languages size={12} className="text-brand" />
                </label>
                <input 
                  value={pNameEn} 
                  onChange={(e)=>setPNameEn(e.target.value)} 
                  dir="ltr" 
                  className={`w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs text-left border transition-colors ${pNameEnError ? 'border-red-500 bg-red-500/5' : 'border-transparent focus:border-brand'}`} 
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest">دسته‌بندی اصلی</label>
                <select value={pCategory} onChange={(e)=>setPCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-transparent focus:border-brand">
                   {categories.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest">تصویر محصول (URL)</label>
                <input value={pImage} onChange={(e)=>setPImage(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-[10px] border border-transparent focus:border-brand" />
             </div>
          </div>
        )}

        {modalTab === 'price' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
             <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl space-y-3 border border-muted/5">
                <div className="flex items-center gap-3 text-brand"><DollarSign size={18}/> <span className="text-[10px] font-black uppercase">قیمت فروش</span></div>
                <input value={pPrice} onChange={(e)=>setPPrice(formatInputNumber(e.target.value))} className="w-full bg-transparent outline-none text-xl font-black" />
             </div>
             <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl space-y-3 border border-muted/5">
                <div className="flex items-center gap-3 text-blue-500"><Zap size={18}/> <span className="text-[10px] font-black uppercase">قیمت خرید</span></div>
                <input value={pWholesale} onChange={(e)=>setPWholesale(formatInputNumber(e.target.value))} className="w-full bg-transparent outline-none text-xl font-black" />
             </div>
             <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl space-y-3 border border-muted/5">
                <div className="flex items-center gap-3 text-red-500"><Percent size={18}/> <span className="text-[10px] font-black uppercase">تخفیف (٪)</span></div>
                <input type="number" value={pDiscount} onChange={(e)=>setPDiscount(Number(e.target.value))} className="w-full bg-transparent outline-none text-xl font-black" />
             </div>
             <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl space-y-3 border border-muted/5">
                <div className="flex items-center gap-3 text-green-500"><Box size={18}/> <span className="text-[10px] font-black uppercase">انبار کل</span></div>
                <input type="number" value={pStock} onChange={(e)=>setPStock(Number(e.target.value))} className="w-full bg-transparent outline-none text-xl font-black" />
             </div>
          </div>
        )}

        {modalTab === 'variants' && (
          <div className="space-y-8 animate-slide-in">
             <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[32px] border border-muted/5 flex flex-col md:flex-row gap-5 items-end">
                <div className="flex-1 space-y-3 w-full">
                   <label className="text-[9px] font-black text-muted uppercase">رنگ</label>
                   <select value={newVColor} onChange={e=>setNewVColor(e.target.value)} className="w-full bg-white dark:bg-black p-4 rounded-xl text-xs font-bold outline-none border border-muted/10">
                      {colorLibrary.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                   </select>
                </div>
                <div className="flex-1 space-y-3 w-full">
                   <label className="text-[9px] font-black text-muted uppercase">گارانتی</label>
                   <select value={newVWarranty} onChange={e=>setNewVWarranty(e.target.value)} className="w-full bg-white dark:bg-black p-4 rounded-xl text-xs font-bold outline-none border border-muted/10">
                      {warrantyLibrary.map(w => <option key={w} value={w}>{w}</option>)}
                   </select>
                </div>
                <button onClick={addVariantRow} className="bg-brand text-primary px-10 py-4 rounded-xl font-black text-xs shadow-lg transition-all hover:scale-105"><Plus size={20}/></button>
             </div>
             <div className="space-y-4">
                {pVariants.map((v, idx) => (
                  <div key={v.id} className="p-6 bg-white dark:bg-[#111125] rounded-[28px] border border-muted/10 grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-brand bg-brand/10 font-black text-xs">{toPersianDigits(idx+1)}</div>
                        <div><p className="text-[10px] font-black">{v.colorName}</p><p className="text-[8px] text-muted font-bold">{v.warrantyName}</p></div>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[8px] font-black text-muted">قیمت اختصاصی</span>
                        <input value={formatInputNumber(v.price)} onChange={e=>handleUpdateVariant(v.id, 'price', cleanPrice(e.target.value))} className="w-full bg-slate-50 dark:bg-black/40 p-2 rounded-lg text-[11px] font-black outline-none" />
                     </div>
                     <div className="space-y-1">
                        <span className="text-[8px] font-black text-muted">موجودی</span>
                        <input type="number" value={v.stock} onChange={e=>handleUpdateVariant(v.id, 'stock', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-black/40 p-2 rounded-lg text-[11px] font-black outline-none" />
                     </div>
                     <button onClick={()=>setPVariants(pVariants.filter(x=>x.id !== v.id))} className="w-fit p-3 text-red-500 hover:bg-red-500/10 rounded-xl lg:self-center"><Trash2 size={18}/></button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {modalTab === 'specs' && (
          <div className="bg-slate-50 dark:bg-white/5 p-10 rounded-[48px] border border-muted/5 grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-in">
             {Object.keys(pSpecs).length > 0 ? Object.entries(pSpecs).map(([key, val]) => (
               <div key={key} className="space-y-2">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest">{key}</label>
                  <input value={val} onChange={e => setPSpecs({ ...pSpecs, [key]: e.target.value })} className="w-full bg-white dark:bg-black/40 p-4 rounded-xl text-xs font-bold border border-muted/10 outline-none focus:border-brand" />
               </div>
             )) : <p className="md:col-span-2 text-center opacity-30 italic py-10">الگوی مشخصاتی برای این دسته تعریف نشده است.</p>}
          </div>
        )}

        {modalTab === 'review' && (
          <div className="space-y-10 animate-slide-in">
             <RichTextEditor 
                label="نقد تخصصی (Expert Review)" 
                value={reviewText} 
                onChange={setReviewText} 
                placeholder="توضیحات کامل محصول را وارد کنید..." 
             />
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black text-green-500 flex items-center gap-2"><CheckCircle2 size={16}/> نقاط مثبت</h5>
                   <input value={newPro} onChange={e=>setNewPro(e.target.value)} onKeyDown={e=>e.key==='Enter' && (setPros([...pros, newPro]), setNewPro(''))} className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-xl text-xs font-bold border border-muted/10 outline-none focus:border-brand" placeholder="افزودن و اینتر..." />
                   <div className="flex flex-wrap gap-2">{pros.map((p,i)=><div key={i} className="bg-green-500/10 text-green-500 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 border border-green-500/10">{p}<X size={12} onClick={()=>setPros(pros.filter((_,idx)=>idx!==i))} className="cursor-pointer"/></div>)}</div>
                </div>
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black text-red-500 flex items-center gap-2"><AlertCircle size={16}/> نقاط ضعف</h5>
                   <input value={newCon} onChange={e=>setNewCon(e.target.value)} onKeyDown={e=>e.key==='Enter' && (setCons([...cons, newCon]), setNewCon(''))} className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-xl text-xs font-bold border border-muted/10 outline-none focus:border-brand" placeholder="افزودن و اینتر..." />
                   <div className="flex flex-wrap gap-2">{cons.map((c,i)=><div key={i} className="bg-red-500/10 text-red-500 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 border border-red-500/10">{c}<X size={12} onClick={()=>setCons(cons.filter((_,idx)=>idx!==i))} className="cursor-pointer"/></div>)}</div>
                </div>
             </div>
          </div>
        )}

        {modalTab === 'seo' && (
          <div className="space-y-10 animate-slide-in pb-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><LinkIcon size={14} className="text-brand"/> نامک محصول (URL Slug)</label>
                   <input value={pSlug} onChange={(e)=>setPSlug(e.target.value)} placeholder="iphone-15-pro-titanium" dir="ltr" className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-transparent focus:border-brand text-left" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><Type size={14} className="text-brand"/> عنوان سئو (Meta Title)</label>
                   <input value={pMetaTitle} onChange={(e)=>setPMetaTitle(e.target.value)} placeholder="خرید گوشی آیفون ۱۵ پرو تیتانیوم | وب‌قاب" className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-transparent focus:border-brand" />
                </div>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><FileText size={14} className="text-brand"/> توضیحات سئو (Meta Description)</label>
                <textarea value={pMetaDescription} onChange={(e)=>setPMetaDescription(e.target.value)} placeholder="توضیحات کوتاه برای نمایش در گوگل (حداکثر ۱۶۰ کاراکتر)" className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-transparent focus:border-brand h-32 resize-none" />
             </div>
          </div>
        )}
      </div>

      <footer className="p-10 border-t border-muted/10 bg-slate-50 dark:bg-white/5 shrink-0 flex items-center justify-between gap-10">
        <button onClick={handleFinalSave} className="flex-1 py-7 rounded-[28px] font-black text-lg shadow-2xl flex items-center justify-center gap-4 transition-all bg-brand text-primary hover:shadow-brand/20 active:scale-95">
           <Save size={24} /> ثبت نهایی محصول در سیستم مرکزی
        </button>
      </footer>
    </div>
  );
};

export default ProductForm;
