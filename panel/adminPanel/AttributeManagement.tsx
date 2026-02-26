
"use client";

import React, { useState, useMemo } from 'react';
import { Tag, Palette, Shield, Search, Trash2, Edit2, Database, Plus, Check, X, ClipboardList } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AttributeManagement: React.FC = () => {
  // exportDatabase destructured from useApp context
  const { 
    brands, colorLibrary, warrantyLibrary, specTemplates, categories,
    updateBrands, updateColors, updateWarranties, updateSpecTemplates, addNotification, exportDatabase
  } = useApp();
  
  const [tab, setTab] = useState<'brands' | 'colors' | 'warranties' | 'specs' | 'maintenance'>('brands');
  const [search, setSearch] = useState('');
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemHex, setNewItemHex] = useState('#000000');
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || '');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase();
    if (tab === 'brands') return brands.filter(b => b.name.toLowerCase().includes(q));
    if (tab === 'colors') return colorLibrary.filter(c => c.name.toLowerCase().includes(q));
    if (tab === 'warranties') return warrantyLibrary.filter(w => w.toLowerCase().includes(q));
    if (tab === 'specs') return specTemplates.filter(s => {
      const catName = categories.find(c => c.id === s.categoryId)?.title || '';
      return catName.toLowerCase().includes(q);
    });
    return [];
  }, [tab, brands, colorLibrary, warrantyLibrary, specTemplates, categories, search]);

  const handleAdd = () => {
    if (!newItemName.trim() && tab !== 'specs') {
      addNotification('نام ویژگی الزامی است.', 'warning');
      return;
    }

    if (tab === 'brands') {
      updateBrands([...brands, { id: `b${Date.now()}`, name: newItemName }]);
    } else if (tab === 'warranties') {
      updateWarranties([...warrantyLibrary, newItemName]);
    } else if (tab === 'colors') {
      updateColors([...colorLibrary, { name: newItemName, hex: newItemHex }]);
    } else if (tab === 'specs') {
      const keys = newItemName.split('\n').filter(k => k.trim());
      updateSpecTemplates([...specTemplates, { categoryId: selectedCatId, keys }]);
    }

    setNewItemName('');
    addNotification('آیتم جدید با موفقیت اضافه شد.', 'success');
  };

  const handleSaveEdit = (originalItem: any) => {
    if (!editValue.trim()) return;
    if (tab === 'brands') {
      updateBrands(brands.map(b => b.id === originalItem.id ? { ...b, name: editValue } : b));
    } else if (tab === 'warranties') {
      updateWarranties(warrantyLibrary.map(w => w === originalItem ? editValue : w));
    } else if (tab === 'colors') {
      updateColors(colorLibrary.map(c => c.name === originalItem.name ? { ...c, name: editValue } : c));
    } else if (tab === 'specs') {
      const keys = editValue.split('\n').filter(k => k.trim());
      updateSpecTemplates(specTemplates.map(s => s.categoryId === originalItem.categoryId ? { ...s, keys } : s));
    }
    setEditingId(null);
    addNotification('تغییرات ذخیره شد.', 'success');
  };

  const handleDelete = (item: any) => {
    if (!confirm('آیا از حذف این مورد اطمینان دارید؟')) return;
    if (tab === 'brands') updateBrands(brands.filter(b => b.id !== item.id));
    else if (tab === 'warranties') updateWarranties(warrantyLibrary.filter(w => w !== item));
    else if (tab === 'colors') updateColors(colorLibrary.filter(c => c.name !== item.name));
    else if (tab === 'specs') updateSpecTemplates(specTemplates.filter(s => s.categoryId !== item.categoryId));
    addNotification('مورد حذف شد.', 'warning');
  };

  return (
    <div className="space-y-10 animate-slide-in pb-20">
      <header className="flex gap-4 md:gap-8 border-b border-muted/10 pb-4 overflow-x-auto no-scrollbar">
        {[
          { id: 'brands', label: 'برندها', icon: Tag },
          { id: 'colors', label: 'رنگ‌ها', icon: Palette },
          { id: 'warranties', label: 'گارانتی‌ها', icon: Shield },
          { id: 'specs', label: 'الگوهای فنی', icon: ClipboardList },
          { id: 'maintenance', label: 'دیتابیس', icon: Database }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => { setTab(t.id as any); setSearch(''); setEditingId(null); }} 
            className={`pb-2 px-2 text-[10px] md:text-sm font-black transition-all border-b-2 flex items-center gap-2 shrink-0 ${tab === t.id ? 'text-brand border-brand' : 'text-muted border-transparent'}`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </header>

      {tab !== 'maintenance' && (
        <div className="bg-white dark:bg-[#111122] p-6 rounded-[32px] border border-muted/10 shadow-lg">
           <h4 className="text-xs font-black mb-6 uppercase tracking-widest text-muted">
             {tab === 'specs' ? 'تعریف ویژگی‌های فنی برای دسته‌بندی' : `افزودن ${tab === 'brands' ? 'برند' : tab === 'colors' ? 'رنگ' : 'گارانتی'} جدید`}
           </h4>
           <div className="flex flex-col gap-4">
              {tab === 'specs' ? (
                <div className="flex flex-col md:flex-row gap-4">
                   <select 
                     value={selectedCatId} 
                     onChange={(e) => setSelectedCatId(e.target.value)}
                     className="md:w-1/3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl outline-none font-bold text-xs border border-muted/5"
                   >
                     {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                   </select>
                   <textarea 
                     placeholder="ویژگی‌ها را وارد کنید (هر ویژگی در یک خط)" 
                     value={newItemName} 
                     onChange={(e) => setNewItemName(e.target.value)}
                     className="flex-1 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl outline-none font-bold text-xs border border-muted/5 min-h-[100px]"
                   />
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-4">
                  <input 
                    placeholder="نام را وارد کنید..." 
                    value={newItemName} 
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl outline-none font-bold text-xs border border-muted/5"
                  />
                  {tab === 'colors' && (
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-2 px-4 rounded-2xl border border-muted/10">
                       <span className="text-[10px] font-black opacity-50 uppercase tracking-tighter">Color:</span>
                       <input type="color" value={newItemHex} onChange={(e) => setNewItemHex(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent" />
                    </div>
                  )}
                </div>
              )}
              <button 
                onClick={handleAdd}
                className="w-full md:w-fit bg-brand text-primary px-10 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl self-end"
              >
                <Plus size={18} /> تایید و ثبت در لیست
              </button>
           </div>
        </div>
      )}

      <div className="max-w-6xl bg-white dark:bg-[#111122] p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-muted/10 shadow-xl">
        {tab === 'maintenance' ? (
          <div className="bg-brand/5 p-8 rounded-[32px] border border-brand/20">
             <h4 className="font-black text-brand mb-4 flex items-center gap-2 uppercase tracking-widest"><Database size={20}/> مدیریت داده‌های دائمی</h4>
             <textarea readOnly value={exportDatabase()} className="w-full h-80 bg-black/5 dark:bg-black/40 p-4 rounded-2xl text-[10px] font-mono outline-none border border-muted/10 mb-6" />
          </div>
        ) : (
          <>
            <div className="relative mb-8">
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
               <input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 p-4 pr-12 rounded-2xl outline-none font-bold text-xs" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, i) => {
                const itemId = typeof item === 'string' ? item : ((item as any).id || (item as any).categoryId || (item as any).name);
                const isEditing = editingId === itemId;
                const displayTitle = tab === 'specs' 
                  ? categories.find(c => c.id === (item as any).categoryId)?.title 
                  : (typeof item === 'string' ? item : (item as any).name);

                return (
                  <div key={i} className={`p-5 rounded-2xl flex flex-col gap-4 border transition-all ${isEditing ? 'border-brand bg-brand/5' : 'bg-slate-50 dark:bg-white/5 border-muted/10'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {tab === 'colors' && <div className="w-5 h-5 rounded-md shadow-sm" style={{backgroundColor: (item as any).hex}} />}
                        <span className="font-black text-xs text-brand">{displayTitle}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <>
                            <button onClick={() => handleSaveEdit(item)} className="text-green-500 p-1.5"><Check size={14}/></button>
                            <button onClick={() => setEditingId(null)} className="text-red-500 p-1.5"><X size={14}/></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditingId(itemId); setEditValue(tab === 'specs' ? (item as any).keys.join('\n') : (typeof item === 'string' ? item : (item as any).name)); }} className="text-blue-500 p-1.5"><Edit2 size={14}/></button>
                            <button onClick={() => handleDelete(item)} className="text-red-500 p-1.5"><Trash2 size={14}/></button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttributeManagement;
