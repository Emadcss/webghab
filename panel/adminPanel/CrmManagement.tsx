
import React, { useState } from 'react';
import { MessageSquare, Search, Filter, CheckCircle, Clock, XCircle, Send, User, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Ticket, TicketStatus, TicketPriority } from '../../types';
import { toPersianDigits, toPersianDigitsGlobal } from '../../utils/helpers';

const CrmManagement: React.FC = () => {
  // Added addTicketMessage from useApp context
  const { tickets, updateTicketStatus, addTicketMessage, user: adminUser } = useApp();
  const [q, setQ] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [reply, setReply] = useState('');

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const filtered = tickets.filter(t => t.userName.includes(q) || t.subject.includes(q));

  const priorityColors: any = {
    [TicketPriority.LOW]: 'bg-slate-500/10 text-slate-500',
    [TicketPriority.MEDIUM]: 'bg-blue-500/10 text-blue-500',
    [TicketPriority.HIGH]: 'bg-orange-500/10 text-orange-500',
    [TicketPriority.CRITICAL]: 'bg-red-500/10 text-red-500 animate-pulse',
  };

  const statusMap: any = {
    [TicketStatus.OPEN]: { label: 'باز', color: 'bg-green-500/10 text-green-500' },
    [TicketStatus.IN_PROGRESS]: { label: 'در حال بررسی', color: 'bg-blue-500/10 text-blue-500' },
    [TicketStatus.CLOSED]: { label: 'بسته شده', color: 'bg-slate-500/10 text-slate-500' },
  };

  const handleSendReply = () => {
    if (!reply.trim() || !selectedTicketId) return;
    // Correctly using addTicketMessage from context
    addTicketMessage(selectedTicketId, {
      id: `msg-${Date.now()}`,
      senderId: adminUser?.id || 'admin',
      senderName: adminUser?.name || 'مدیریت',
      text: reply,
      timestamp: new Date().toISOString(),
      isAdmin: true
    });
    setReply('');
    updateTicketStatus(selectedTicketId, TicketStatus.IN_PROGRESS);
  };

  return (
    <div className="h-full flex flex-col space-y-8 animate-slide-in">
       <header className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black">مرکز CRM وب‌قاب</h2>
            <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">Customer Relationship Management</p>
          </div>
          <div className="relative w-80">
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
             <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="جستجوی تیکت یا کاربر..." className="w-full bg-white dark:bg-[#000028] p-4 pr-12 rounded-2xl outline-none font-bold border border-muted/10" />
          </div>
       </header>

       <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
          {/* Ticket List */}
          <div className="lg:col-span-4 bg-white dark:bg-[#000028] rounded-[40px] border border-muted/10 overflow-hidden flex flex-col shadow-xl">
             <div className="p-6 border-b border-muted/5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-muted tracking-widest">لیست تیکت‌ها</span>
                <span className="text-[10px] bg-brand/10 text-brand px-2 py-1 rounded-lg font-black">{toPersianDigits(filtered.length)} مورد</span>
             </div>
             <div className="flex-1 overflow-y-auto no-scrollbar">
                {filtered.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full p-6 text-right border-b border-muted/5 transition-all hover:bg-slate-50 dark:hover:bg-white/5 ${selectedTicketId === t.id ? 'bg-brand/5 border-r-4 border-r-brand' : ''}`}
                  >
                     <div className="flex justify-between items-start mb-2">
                        {/* Fixed type unknown error by ensuring TicketStatus mapping is correct */}
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded ${statusMap[t.status as TicketStatus].color}`}>{statusMap[t.status as TicketStatus].label}</span>
                        <span className="text-[9px] text-muted font-bold">{toPersianDigitsGlobal(new Date(t.createdAt).toLocaleDateString('fa-IR'))}</span>
                     </div>
                     <h4 className="text-[11px] font-black line-clamp-1">{toPersianDigitsGlobal(t.subject)}</h4>
                     <p className="text-[10px] text-muted font-bold mt-1 flex items-center gap-2"><User size={12}/> {t.userName}</p>
                     <div className={`mt-3 px-2 py-1 rounded-lg w-fit text-[8px] font-black ${priorityColors[t.priority as TicketPriority]}`}>
                        اولویت: {t.priority === TicketPriority.CRITICAL ? 'بحرانی' : t.priority === TicketPriority.HIGH ? 'بالا' : 'معمولی'}
                     </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="p-10 text-center opacity-30">
                     <MessageSquare size={48} className="mx-auto mb-4" />
                     <p className="text-xs font-bold">تیکتی یافت نشد.</p>
                  </div>
                )}
             </div>
          </div>

          {/* Conversation Area */}
          <div className="lg:col-span-8 bg-white dark:bg-[#000028] rounded-[40px] border border-muted/10 shadow-2xl flex flex-col overflow-hidden">
             {selectedTicket ? (
               <>
                 <header className="p-6 bg-slate-50 dark:bg-white/5 border-b border-muted/10 flex items-center justify-between">
                    <div>
                       <h3 className="text-sm font-black">{toPersianDigitsGlobal(selectedTicket.subject)}</h3>
                       <p className="text-[10px] text-muted mt-1">شناسه تیکت: {toPersianDigits(selectedTicket.id)} | دسته‌بندی: {selectedTicket.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <select 
                         value={selectedTicket.status}
                         onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as TicketStatus)}
                         className="bg-white dark:bg-black p-2 rounded-xl text-[10px] font-black outline-none border border-muted/10"
                       >
                          {Object.entries(TicketStatus).map(([k,v]) => <option key={k} value={v}>{statusMap[v].label}</option>)}
                       </select>
                    </div>
                 </header>

                 <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                    {selectedTicket.messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'}`}>
                         <div className={`max-w-[80%] p-4 rounded-3xl text-[11px] leading-relaxed font-bold shadow-sm ${msg.isAdmin ? 'bg-brand text-primary rounded-tr-none' : 'bg-slate-100 dark:bg-white/5 text-primary dark:text-white rounded-tl-none'}`}>
                            {toPersianDigitsGlobal(msg.text)}
                         </div>
                         <span className="text-[8px] text-muted mt-2 font-bold">{toPersianDigitsGlobal(new Date(msg.timestamp).toLocaleTimeString('fa-IR'))} - {msg.senderName}</span>
                      </div>
                    ))}
                 </div>

                 <div className="p-6 bg-slate-50 dark:bg-white/5 border-t border-muted/10">
                    <div className="flex gap-4">
                       <textarea 
                         value={reply}
                         onChange={(e)=>setReply(e.target.value)}
                         placeholder="پاسخ خود را بنویسید..."
                         className="flex-1 bg-white dark:bg-black p-4 rounded-2xl outline-none font-bold text-xs resize-none border border-muted/10"
                         rows={2}
                       />
                       <button 
                         onClick={handleSendReply}
                         className="bg-brand text-primary px-8 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2"
                       >
                          <Send size={20} />
                          <span className="text-[9px]">ارسال</span>
                       </button>
                    </div>
                 </div>
               </>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                  <AlertCircle size={64} strokeWidth={1} />
                  <p className="mt-4 font-black italic">برای نمایش گفتگو، یک تیکت را انتخاب کنید.</p>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default CrmManagement;
