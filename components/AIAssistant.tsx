
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { Product } from '../types';
import { toPersianDigitsGlobal } from '../utils/helpers';

const AIAssistant: React.FC<{ product: Product }> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `شما کارشناس فروشگاه "وب‌قاب" هستید. مشخصات محصول زیر را بررسی کنید:
      نام: ${product.name}
      دسته: ${product.category}
      مشخصات: ${JSON.stringify(product.specs)}
      سوال کاربر: ${userMsg}
      لطفا با لحنی لوکس، مودبانه و تخصصی به زبان فارسی پاسخ دهید.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'پوزش می‌طلبم، در حال حاضر قادر به پاسخگویی نیستم.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'خطایی در ارتباط با هوش مصنوعی رخ داد.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-32 left-10 z-[150] md:bottom-10">
      {isOpen ? (
        <div className="w-80 md:w-96 bg-white dark:bg-[#000038] rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-brand/20 overflow-hidden animate-slide-up flex flex-col h-[500px]">
          <header className="p-6 bg-brand text-primary flex justify-between items-center">
            <div className="flex items-center gap-3">
               <Bot size={24} />
               <span className="font-black text-xs uppercase tracking-widest">مشاوره هوشمند وب‌قاب</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20}/></button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
             <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl text-[11px] font-bold leading-relaxed">
                سلام! من دستیار هوشمند وب‌قاب هستم. چطور می‌تونم در مورد خرید <span className="text-brand">{product.name}</span> به شما کمک کنم؟
             </div>
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[10px] font-medium leading-relaxed ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-brand/10 text-primary dark:text-white rounded-tl-none border border-brand/20'}`}>
                    {toPersianDigitsGlobal(m.text)}
                  </div>
               </div>
             ))}
             {loading && (
               <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-brand" />
                    <span className="text-[10px] font-black animate-pulse">در حال تحلیل...</span>
                  </div>
               </div>
             )}
          </div>

          <div className="p-4 border-t border-muted/10 flex gap-2">
             <input 
               value={query}
               onChange={e=>setQuery(e.target.value)}
               onKeyDown={e=>e.key==='Enter' && handleAskAI()}
               placeholder="سوال تخصصی شما..."
               className="flex-1 bg-slate-50 dark:bg-white/5 p-4 rounded-xl outline-none text-xs font-bold border border-transparent focus:border-brand"
             />
             <button onClick={handleAskAI} className="bg-brand text-primary p-4 rounded-xl shadow-lg hover:scale-105 transition-all"><Send size={20}/></button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-brand text-primary p-5 rounded-full shadow-[0_20px_40px_rgba(255,157,46,0.3)] hover:scale-110 active:scale-95 transition-all flex items-center gap-3 group"
        >
          <Sparkles className="group-hover:rotate-12 transition-transform" />
          <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">مشاوره هوشمند کالا</span>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
