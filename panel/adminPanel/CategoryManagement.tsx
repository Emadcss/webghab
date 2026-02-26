
import React, { useState, useMemo } from 'react';
import { 
  Layers, Plus, Trash2, Edit2, Check, X, Image as ImageIcon, LayoutGrid, 
  Smartphone, Tablet, Headphones, Watch, Gamepad2, Laptop, Shield, Zap, 
  Speaker, Cpu, ChevronLeft, ChevronRight, FolderOpen, ArrowRight, Home, ListTree, MousePointer2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { toPersianDigits } from '../../utils/helpers';

const iconOptions = [
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Tablet', icon: Tablet },
  { name: 'Laptop', icon: Laptop },
  { name: 'Watch', icon: Watch },
  { name: 'Headphones', icon: Headphones },
  { name: 'Shield', icon: Shield },
  { name: 'Zap', icon: Zap },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Speaker', icon: Speaker },
  { name: 'Cpu', icon: Cpu }
];

const CategoryManagement: React.FC = () => {
  const { categories, updateCategories, addNotification } = useApp();
  const [path, setPath] = useState<Category[]>([]); // Breadcrumb path
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Category>>({
    title: '',
    icon: 'Smartphone',
    description: '',
    image: ''
  });

  // Helper to find the current children list based on path
  const currentCategories = useMemo(() => {
    if (path.length === 0) return categories;
    let current = categories;
    for (const step of path) {
      const found = current.find(c => c.id === step.id);
      if (found && found.children) {
        current = found.children;
      } else {
        return [];
      }
    }
    return current;
  }, [categories, path]);

  // Recursive function to update the tree
  const updateTree = (tree: Category[], targetPath: Category[], action: 'add' | 'edit' | 'delete', data?: Category, id?: string): Category[] => {
    if (targetPath.length === 0) {
      if (action === 'add' && data) return [...tree, data];
      if (action === 'edit' && data) return tree.map(c => c.id === data.id ? { ...c, ...data } : c);
      if (action === 'delete' && id) return tree.filter(c => c.id !== id);
      return tree;
    }

    const [currentStep, ...remainingPath] = targetPath;
    return tree.map(node => {
      if (node.id === currentStep.id) {
        return {
          ...node,
          children: updateTree(node.children || [], remainingPath, action, data, id)
        };
      }
      return node;
    });
  };

  const handleSave = () => {
    if (!formData.title) {
      addNotification('عنوان دسته‌بندی الزامی است.', 'error');
      return;
    }

    if (editingId) {
      const updatedNode = { ...formData, id: editingId } as Category;
      const newTree = updateTree(categories, path, 'edit', updatedNode);
      updateCategories(newTree);
      addNotification('تغییرات با موفقیت اعمال شد.', 'success');
    } else {
      const newCat: Category = {
        ...formData as Category,
        id: `cat-${Date.now()}`,
        children: []
      };
      const newTree = updateTree(categories, path, 'add', newCat);
      updateCategories(newTree);
      addNotification('دسته‌بندی جدید اضافه شد.', 'success');
    }

    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ title: '', icon: 'Smartphone', description: '', image: '' });
  };

  const handleEditClick = (cat: Category) => {
    setEditingId(cat.id);
    setFormData(cat);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این مورد و تمام زیرمجموعه‌های آن اطمینان دارید؟')) {
      const newTree = updateTree(categories, path, 'delete', undefined, id);
      updateCategories(newTree);
      addNotification('دسته و زیرمجموعه‌ها حذف شدند.', 'warning');
    }
  };

  const drillDown = (cat: Category) => {
    setPath([...path, cat]);
    resetForm();
  };

  const goBack = () => {
    setPath(path.slice(0, -1));
    resetForm();
  };

  const goToRoot = () => {
    setPath([]);
    resetForm();
  };

  return (
    <div className="space-y-10 animate-slide-in pb-20">
      <header className="bg-white dark:bg-white/5 p-8 rounded-[40px] border border-muted/10">
        <div className="flex justify-between items-center mb-8">
           <div>
              <h2 className="text-3xl font-black">مهندسی ساختار درختی (Menu Architect)</h2>
              <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">Multi-Level Hierarchy Engine</p>
           </div>
           {!isAdding && (
             <button 
               onClick={() => setIsAdding(true)}
               className="bg-brand text-primary px-10 py-5 rounded-[24px] font-black text-xs flex items-center gap-3 shadow-2xl hover:scale-105 transition-all"
             >
               <Plus size={22} /> افزودن به این سطح
             </button>
           )}
        </div>

        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center gap-3 bg-slate-50 dark:bg-black/20 p-4 rounded-2xl overflow-x-auto no-scrollbar">
           <button onClick={goToRoot} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${path.length === 0 ? 'bg-brand text-primary font-black' : 'text-muted hover:bg-brand/10'}`}>
              <Home size={16}/> ریشه
           </button>
           {path.map((step, idx) => (
             <React.Fragment key={step.id}>
                <ChevronLeft size={14} className="text-muted/40 shrink-0" />
                <button 
                  onClick={() => setPath(path.slice(0, idx + 1))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${idx === path.length - 1 ? 'bg-brand text-primary font-black' : 'text-muted hover:bg-brand/10'}`}
                >
                   {step.title}
                </button>
             </React.Fragment>
           ))}
        </nav>
      </header>

      {isAdding && (
        <div className="bg-white dark:bg-[#0a0a20] p-10 rounded-[48px] border-2 border-brand/20 shadow-2xl space-y-10 animate-slide-up">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black flex items-center gap-4">
                 <ListTree className="text-brand" size={32} /> 
                 {editingId ? 'ویرایش عنوان و ویژگی' : `ایجاد زیرمجموعه جدید در: ${path.length > 0 ? path[path.length-1].title : 'ریشه'}`}
              </h3>
              <button onClick={resetForm} className="p-3 hover:bg-red-500/10 text-red-500 rounded-2xl transition-all"><X size={28}/></button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><MousePointer2 size={14}/> عنوان آیتم منو</label>
                 <input 
                   value={formData.title} 
                   onChange={e => setFormData({...formData, title: e.target.value})}
                   className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-sm border border-muted/5 focus:border-brand" 
                   placeholder="مثلا: لوازم جانبی"
                 />
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><LayoutGrid size={14}/> آیکون نمایشی</label>
                 <div className="flex flex-wrap gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-muted/5">
                    {iconOptions.map(opt => (
                      <button 
                        key={opt.name}
                        onClick={() => setFormData({...formData, icon: opt.name})}
                        className={`p-4 rounded-xl transition-all ${formData.icon === opt.name ? 'bg-brand text-primary shadow-xl scale-110' : 'text-muted hover:bg-brand/10'}`}
                      >
                         <opt.icon size={20} />
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14}/> تصویر شاخص هاب (اختیاری)</label>
                 <input 
                   value={formData.image} 
                   onChange={e => setFormData({...formData, image: e.target.value})}
                   className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-muted/5 focus:border-brand" 
                   placeholder="Image URL..."
                 />
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> توضیحات سئو</label>
                 <input 
                   value={formData.description} 
                   onChange={e => setFormData({...formData, description: e.target.value})}
                   className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-muted/5 focus:border-brand" 
                   placeholder="متنی برای نمایش در هاب مشتری..."
                 />
              </div>
           </div>

           <div className="pt-6 border-t border-muted/5 flex gap-4">
             <button 
               onClick={handleSave}
               className="flex-1 bg-brand text-primary py-7 rounded-[28px] font-black text-sm shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 transition-all"
             >
                <Check size={26} /> تایید و ثبت تغییرات
             </button>
             <button onClick={resetForm} className="px-10 py-7 rounded-[28px] bg-slate-100 dark:bg-white/5 font-black text-xs">انصراف</button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentCategories.map(cat => {
          const Icon = iconOptions.find(o => o.name === cat.icon)?.icon || Smartphone;
          const childCount = cat.children?.length || 0;

          return (
            <div key={cat.id} className="bg-white dark:bg-[#0a0a1a] rounded-[40px] border border-muted/10 shadow-2xl group hover:border-brand/40 transition-all flex flex-col overflow-hidden">
               <div className="p-8">
                 <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-5">
                       <div className="w-16 h-16 bg-brand/10 text-brand rounded-[24px] flex items-center justify-center shadow-inner group-hover:bg-brand group-hover:text-primary transition-all">
                          <Icon size={32} />
                       </div>
                       <div>
                          <h4 className="font-black text-base">{cat.title}</h4>
                          <p className="text-[9px] text-muted font-bold mt-1 uppercase tracking-widest">{toPersianDigits(childCount)} زیرمجموعه فعال</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => handleEditClick(cat)} className="p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"><Edit2 size={18}/></button>
                       <button onClick={() => handleDelete(cat.id)} className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18}/></button>
                    </div>
                 </div>

                 <button 
                  onClick={() => drillDown(cat)}
                  className="w-full py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-muted/5 font-black text-[10px] text-primary dark:text-white flex items-center justify-center gap-3 hover:bg-brand hover:text-primary transition-all group/btn"
                 >
                    <FolderOpen size={16} className="text-brand group-hover/btn:text-primary" /> مدیریت زیرمجموعه‌های {cat.title}
                 </button>
               </div>
               
               {cat.image && (
                  <div className="mt-auto relative aspect-[21/9] grayscale-[0.4] group-hover:grayscale-0 transition-all border-t border-muted/5 overflow-hidden">
                    <img src={cat.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
               )}
            </div>
          );
        })}

        {currentCategories.length === 0 && !isAdding && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted opacity-30">
             <ListTree size={80} strokeWidth={1} />
             <p className="mt-6 font-black italic">در این سطح هنوز زیرمجموعه‌ای تعریف نشده است.</p>
             <button onClick={() => setIsAdding(true)} className="mt-6 text-brand font-black underline">ایجاد اولین زیرمجموعه</button>
          </div>
        )}
      </div>

      {path.length > 0 && !isAdding && (
        <button 
          onClick={goBack}
          className="fixed bottom-10 left-10 md:left-auto md:right-96 z-50 bg-primary dark:bg-brand text-white dark:text-primary px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 hover:scale-110 transition-all"
        >
          <ArrowRight size={20} /> بازگشت به سطح قبل
        </button>
      )}
    </div>
  );
};

export default CategoryManagement;
