
import React, { useState } from 'react';
import { 
  ShieldAlert, Ban, Search, Plus, Trash2, AlertTriangle, CheckCircle, Info, 
  MessageSquare, User, Star, Check, X, Clock, Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toPersianDigits, toPersianDigitsGlobal } from '../../utils/helpers';

const ModerationManagement: React.FC = () => {
  // Destructured updateWordFilter from useApp context
  const { wordFilter, updateWordFilter, comments, addNotification } = useApp();
  const [newWord, setNewWord] = useState('');
  const [q, setQ] = useState('');
  const [activeTab, setActiveTab] = useState<'blacklist' | 'queue'>('blacklist');

  const filteredWords = wordFilter.filter(w => w.includes(q));

  const handleAddWord = () => {
    if (!newWord.trim()) return;
    if (wordFilter.includes(newWord.trim())) {
      addNotification('این کلمه در لیست موجود است.', 'warning');
      return;
    }
    // Correctly using updateWordFilter from context
    updateWordFilter([...wordFilter, newWord.trim()]);
    setNewWord('');
    addNotification('کلمه به لیست سیاه اضافه شد.', 'success');
  };

  const handleRemoveWord = (word: string) => {
    // Correctly using updateWordFilter from context
    updateWordFilter(wordFilter.filter(w => w !== word));
    addNotification('کلمه از لیست حذف شد.', 'warning');
  };

  return (
    <div className="space-y-10 animate-slide-in pb-20">
      <header className="flex justify-between items-center bg-white dark:bg-white/5 p-8 rounded-[40px] border border-muted/10">
        <div>
           <h2 className="text-3xl font-black">مرکز پایش و فیلترینگ</h2>
           <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">Content Safety Control Hub</p>
        </div>
        <div className="flex gap-2 bg-slate-100 dark:bg-black p-1.5 rounded-2xl">
           <button onClick={()=>setActiveTab('blacklist')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'blacklist' ? 'bg-brand text-primary shadow-lg' : 'text-muted'}`}>لیست سیاه کلمات</button>
           <button onClick={()=>setActiveTab('queue')} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'queue' ? 'bg-brand text-primary shadow-lg' : 'text-muted'}`}>تایید نظرات</button>
        </div>
      </header>

      {activeTab === 'blacklist' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-[#0a0a1a] p-8 rounded-[40px] border border-muted/10 shadow-2xl">
                <h3 className="text-sm font-black mb-6 flex items-center gap-3"><Ban className="text-red-500" size={20}/> کلمه ممنوعه جدید</h3>
                <div className="space-y-4">
                    <input 
                      value={newWord}
                      onChange={e => setNewWord(e.target.value)}
                      placeholder="کلمه یا عبارت حساس..."
                      className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-xs border border-muted/5 focus:border-red-500"
                    />
                    <button 
                      onClick={handleAddWord}
                      className="w-full bg-red-500 text-white py-5 rounded-2xl font-black text-xs shadow-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all"
                    >
                      <Plus size={18}/> ثبت در لیست نظارتی
                    </button>
                </div>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-[40px] space-y-4">
                <div className="flex items-center gap-3 text-blue-500">
                    <Info size={22} />
                    <h4 className="text-xs font-black">منطق هوشمند فیلتر</h4>
                </div>
                <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                    این لیست به صورت Real-time تمام کامنت‌ها را اسکن می‌کند. کلمات موجود بدون نیاز به تایید ادمین، بلافاصله در فرانت با *** جایگزین می‌شوند.
                </p>
              </div>
          </div>

          <div className="lg:col-span-8">
              <div className="bg-white dark:bg-[#0a0a1a] p-10 rounded-[48px] border border-muted/10 shadow-2xl min-h-[500px] flex flex-col">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black flex items-center gap-3"><Filter size={24} className="text-brand"/> کلمات تحت مانیتورینگ</h3>
                    <div className="relative w-72">
                      <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-muted" size={18} />
                      <input 
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder="جستجو در لیست..."
                        className="w-full bg-slate-50 dark:bg-black/20 p-4 pr-12 rounded-2xl outline-none font-bold text-xs"
                      />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {filteredWords.length > 0 ? (
                      <div className="flex flex-wrap gap-4">
                        {filteredWords.map(word => (
                          <div key={word} className="group flex items-center gap-3 bg-slate-50 dark:bg-white/5 border border-muted/5 px-5 py-3 rounded-2xl transition-all hover:border-red-500/40">
                              <span className="text-xs font-black">{word}</span>
                              <button 
                                onClick={() => handleRemoveWord(word)}
                                className="text-muted hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 size={16}/>
                              </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-30 py-20">
                        <ShieldAlert size={80} strokeWidth={1} />
                        <p className="mt-6 font-black italic text-lg">لیست نظارتی خالی است.</p>
                      </div>
                    )}
                </div>

                <div className="mt-10 pt-8 border-t border-muted/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-[3px]">Global Blacklist Repository</span>
                    <span className="text-xs font-black bg-brand/10 text-brand px-4 py-2 rounded-xl">{toPersianDigits(wordFilter.length)} عبارت فعال</span>
                </div>
              </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0a0a1a] p-10 rounded-[48px] border border-muted/10 shadow-2xl animate-slide-in">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black">صف انتظار تایید نظرات</h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-600 rounded-xl text-[10px] font-black">
                 <Clock size={14}/> {toPersianDigits(comments.length)} مورد در انتظار
              </div>
           </div>

           <div className="space-y-6">
              {comments.map(c => (
                <div key={c.id} className="p-8 bg-slate-50 dark:bg-white/5 rounded-[36px] border border-muted/5 group">
                   <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-1 space-y-4">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center font-black">
                               {c.userName.charAt(0)}
                            </div>
                            <div>
                               <h4 className="font-black text-sm">{c.userName}</h4>
                               <p className="text-[9px] text-muted font-bold mt-1">شناسه محصول: {toPersianDigits(c.productId)}</p>
                            </div>
                         </div>
                         <p className="text-xs font-bold leading-relaxed text-muted-foreground bg-white dark:bg-black/20 p-5 rounded-2xl">
                            {toPersianDigitsGlobal(c.text)}
                         </p>
                         <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= c.rating ? 'fill-brand text-brand' : 'text-muted/20'} />)}
                         </div>
                      </div>
                      <div className="flex gap-3">
                         <button className="bg-green-500 text-white p-4 rounded-2xl shadow-lg hover:scale-110 transition-all flex items-center gap-2 text-[10px] font-black"><Check size={18}/> تایید انتشار</button>
                         <button className="bg-red-500 text-white p-4 rounded-2xl shadow-lg hover:scale-110 transition-all flex items-center gap-2 text-[10px] font-black"><X size={18}/> حذف کامل</button>
                      </div>
                   </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="py-40 text-center opacity-30">
                   <CheckCircle size={80} strokeWidth={1} className="mx-auto mb-6 text-green-500" />
                   <p className="font-black italic text-lg">تمام نظرات بازبینی شده‌اند.</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default ModerationManagement;
