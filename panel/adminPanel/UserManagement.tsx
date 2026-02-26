
import React, { useState } from 'react';
import { Users, Search, ShieldCheck, UserMinus, UserCheck, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

const UserManagement: React.FC = () => {
  const { allUsers, updateUserStatus } = useApp();
  const [q, setQ] = useState('');

  const filtered = allUsers.filter(u => u.name.includes(q) || u.email.includes(q));

  return (
    <div className="space-y-8 animate-slide-in">
       <header className="flex justify-between items-center">
          <h2 className="text-3xl font-black">مدیریت کاربران</h2>
          <div className="relative w-72">
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
             <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="جستجوی کاربر..." className="w-full bg-white dark:bg-[#000028] p-4 pr-12 rounded-2xl outline-none font-bold border border-muted/10" />
          </div>
       </header>

       <div className="bg-white dark:bg-[#000028] rounded-[40px] shadow-xl overflow-hidden border border-muted/10">
          <table className="w-full text-right">
             <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black text-muted uppercase tracking-widest">
                <tr><th className="p-8">نام کاربر</th><th className="p-8">ایمیل</th><th className="p-8">نقش</th><th className="p-8">وضعیت</th><th className="p-8 text-center">عملیات</th></tr>
             </thead>
             <tbody className="divide-y divide-muted/10">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                     <td className="p-8 font-black text-xs">{u.name}</td>
                     <td className="p-8 font-bold text-xs text-muted">{u.email}</td>
                     <td className="p-8">
                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black ${u.role === UserRole.PARTNER ? 'bg-brand/10 text-brand' : 'bg-blue-500/10 text-blue-500'}`}>
                           {u.role === UserRole.PARTNER ? 'همکار تجاری' : u.role === UserRole.ADMIN ? 'مدیریت ارشد' : 'مشتری عادی'}
                        </span>
                     </td>
                     <td className="p-8">
                        <span className={`px-2 py-1 rounded-md text-[8px] font-black ${u.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                           {u.status === 'ACTIVE' ? 'فعال' : 'مسدود'}
                        </span>
                     </td>
                     <td className="p-8 flex justify-center gap-3">
                        {u.role !== UserRole.ADMIN && (
                          <>
                             <button onClick={() => updateUserStatus(u.id, u.status, u.role === UserRole.PARTNER ? UserRole.CUSTOMER : UserRole.PARTNER)} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl" title="تغییر نقش"><ShieldCheck size={18} /></button>
                             <button onClick={() => updateUserStatus(u.id, u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE')} className={`p-2.5 rounded-xl ${u.status === 'ACTIVE' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                {u.status === 'ACTIVE' ? <UserMinus size={18} /> : <UserCheck size={18} />}
                             </button>
                          </>
                        )}
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default UserManagement;
