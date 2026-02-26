
import React, { useState, useMemo } from 'react';
import { 
  UserCog, ShieldCheck, Activity, Clock, Search, Filter, 
  CheckCircle2, XCircle, AlertCircle, Eye, Settings, 
  TrendingUp, Wallet, Award, UserPlus, Hash, Calendar, Zap, Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminPermission, User, UserRole, AdminLog, AdminSession } from '../../types';
import { toPersianDigits, toPersianDigitsGlobal } from '../../utils/helpers';

const AdminManagement: React.FC = () => {
  const { allUsers, adminLogs, adminSessions, updateAdminPermissions, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'admins' | 'logs' | 'sessions'>('admins');
  const [q, setQ] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  const admins = useMemo(() => allUsers.filter(u => u.role === UserRole.ADMIN), [allUsers]);
  const filteredAdmins = admins.filter(a => a.name.includes(q) || a.email.includes(q));

  const permissionsList = Object.values(AdminPermission);

  const handleTogglePermission = (adminId: string, perm: AdminPermission) => {
    const admin = allUsers.find(u => u.id === adminId);
    if (!admin) return;
    
    const currentPerms = admin.permissions || [];
    const newPerms = currentPerms.includes(perm)
      ? currentPerms.filter(p => p !== perm)
      : [...currentPerms, perm];
    
    updateAdminPermissions(adminId, newPerms);
  };

  const getAdminActivityCount = (adminId: string) => {
    return adminLogs.filter(l => l.adminId === adminId).length;
  };

  const getAdminTotalOnlineTime = (adminId: string) => {
    return adminSessions
      .filter(s => s.adminId === adminId && s.durationMinutes)
      .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  };

  return (
    <div className="space-y-10 animate-slide-in pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black">ماژول میدران (مدیریت ادمین‌ها)</h2>
          <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">Admin Control & Performance Matrix</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-muted/5">
           {[
             { id: 'admins', label: 'لیست ادمین‌ها', icon: UserCog },
             { id: 'logs', label: 'وقایع عملیاتی', icon: Activity },
             { id: 'sessions', label: 'مانیتورینگ حضور', icon: Clock }
           ].map(t => (
             <button 
               key={t.id} 
               onClick={() => setActiveTab(t.id as any)} 
               className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === t.id ? 'bg-brand text-primary shadow-lg' : 'text-muted hover:text-brand'}`}
             >
                <t.icon size={16}/> {t.label}
             </button>
           ))}
        </div>
      </header>

      {activeTab === 'admins' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8">
              <div className="bg-white dark:bg-[#0a0a1a] rounded-[48px] border border-muted/10 shadow-xl overflow-hidden">
                 <div className="p-8 border-b border-muted/5 flex justify-between items-center bg-slate-50 dark:bg-black/20">
                    <div className="relative w-72">
                       <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                       <input 
                         value={q} 
                         onChange={e=>setQ(e.target.value)} 
                         placeholder="جستجوی ادمین..." 
                         className="w-full bg-white dark:bg-black/40 p-3 pr-11 rounded-2xl outline-none font-bold text-xs" 
                       />
                    </div>
                    <span className="text-[10px] font-black bg-brand/10 text-brand px-4 py-2 rounded-xl">{toPersianDigits(filteredAdmins.length)} ادمین فعال</span>
                 </div>
                 
                 <div className="overflow-x-auto">
                    <table className="w-full text-right">
                       <thead className="bg-slate-50 dark:bg-white/5 text-[9px] font-black text-muted uppercase tracking-widest">
                          <tr>
                             <th className="p-6">هویت ادمین</th>
                             <th className="p-6">مجموع فعالیت‌ها</th>
                             <th className="p-6">زمان آنلاین کل</th>
                             <th className="p-6">وضعیت فعلی</th>
                             <th className="p-6 text-center">مدیریت</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-muted/10">
                          {filteredAdmins.map(admin => {
                             const isOnline = adminSessions.some(s => s.adminId === admin.id && s.status === 'ONLINE');
                             return (
                               <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                                  <td className="p-6">
                                     <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-tr from-primary to-blue-900 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
                                           {admin.name.charAt(0)}
                                        </div>
                                        <div>
                                           <p className="font-black text-xs">{admin.name}</p>
                                           <p className="text-[8px] text-muted font-bold mt-1 uppercase tracking-tighter">{admin.email}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="p-6">
                                     <div className="flex items-center gap-2">
                                        <TrendingUp size={14} className="text-green-500" />
                                        <span className="text-xs font-black">{toPersianDigits(getAdminActivityCount(admin.id))} عمل</span>
                                     </div>
                                  </td>
                                  <td className="p-6">
                                     <span className="text-xs font-black">{toPersianDigits(getAdminTotalOnlineTime(admin.id))} دقیقه</span>
                                  </td>
                                  <td className="p-6">
                                     <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                                        <span className="text-[9px] font-black uppercase">{isOnline ? 'Online' : 'Offline'}</span>
                                     </div>
                                  </td>
                                  <td className="p-6 flex justify-center">
                                     <button 
                                      onClick={() => setSelectedAdminId(admin.id)}
                                      className="p-3 bg-brand/10 text-brand rounded-xl hover:bg-brand hover:text-primary transition-all"
                                     >
                                        <Settings size={18}/>
                                     </button>
                                  </td>
                               </tr>
                             );
                          })}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4">
              <div className="bg-white dark:bg-[#0a0a1a] p-10 rounded-[48px] border-2 border-brand/20 shadow-2xl sticky top-32 h-fit">
                 {selectedAdminId ? (
                   <div className="space-y-8 animate-slide-in">
                      <div className="flex justify-between items-start">
                         <h3 className="text-xl font-black">تنظیم دسترسی‌ها</h3>
                         <button onClick={()=>setSelectedAdminId(null)} className="p-2 text-muted hover:text-red-500"><XCircle size={20}/></button>
                      </div>
                      
                      <div className="p-6 bg-brand/5 rounded-3xl border border-brand/10 text-center">
                         <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">در حال ویرایش</p>
                         <h4 className="text-sm font-black text-brand">{allUsers.find(u=>u.id===selectedAdminId)?.name}</h4>
                      </div>

                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                         {permissionsList.map(perm => {
                            const isActive = allUsers.find(u=>u.id===selectedAdminId)?.permissions?.includes(perm);
                            return (
                               <button 
                                 key={perm}
                                 onClick={() => handleTogglePermission(selectedAdminId, perm)}
                                 className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isActive ? 'bg-green-500/10 border-green-500/30 text-green-600' : 'bg-slate-50 dark:bg-white/5 border-muted/5 text-muted'}`}
                               >
                                  <span className="text-[10px] font-black uppercase tracking-tighter">{perm.replace('MANAGE_', '').replace('_', ' ')}</span>
                                  {isActive ? <ShieldCheck size={18}/> : <Lock size={16}/>}
                               </button>
                            );
                         })}
                      </div>
                      
                      <p className="text-[9px] font-bold text-muted text-center italic">تغییرات به محض کلیک ذخیره و در نشست بعدی ادمین اعمال می‌شوند.</p>
                   </div>
                 ) : (
                   <div className="py-20 text-center space-y-6 opacity-30">
                      <Award size={64} className="mx-auto" strokeWidth={1} />
                      <p className="font-black italic text-sm">برای مدیریت مجوزها و مشاهده عملکرد، یک ادمین را از لیست انتخاب کنید.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-[#0a0a1a] rounded-[48px] border border-muted/10 shadow-xl overflow-hidden animate-slide-in">
           <div className="p-10 border-b border-muted/5 flex items-center gap-4">
              <Activity className="text-brand" size={24}/>
              <h3 className="text-xl font-black">لاگ عملیاتی ادمین‌ها</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-right">
                 <thead className="bg-slate-50 dark:bg-white/5 text-[9px] font-black text-muted uppercase tracking-widest">
                    <tr>
                       <th className="p-6">زمان دقیق</th>
                       <th className="p-6">اپراتور</th>
                       <th className="p-6">ماژول</th>
                       <th className="p-6">نوع عملیات</th>
                       <th className="p-6">جزئیات ثبت شده</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-muted/10">
                    {adminLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                         <td className="p-6 text-[10px] font-bold text-muted" dir="ltr">{toPersianDigitsGlobal(new Date(log.timestamp).toLocaleString('fa-IR'))}</td>
                         <td className="p-6 font-black text-xs text-brand">{log.adminName}</td>
                         <td className="p-6"><span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[8px] font-black">{log.module}</span></td>
                         <td className="p-6 font-bold text-xs uppercase">{log.action.replace('_', ' ')}</td>
                         <td className="p-6 text-[10px] font-medium opacity-60">{toPersianDigitsGlobal(log.details)}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
              {adminLogs.length === 0 && (
                <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
                   <Activity size={64}/>
                   <p className="font-black italic">هنوز فعالیتی در سیستم ثبت نشده است.</p>
                </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="bg-white dark:bg-[#0a0a1a] rounded-[48px] border border-muted/10 shadow-xl overflow-hidden animate-slide-in">
           <div className="p-10 border-b border-muted/5 flex items-center gap-4">
              <Clock className="text-brand" size={24}/>
              <h3 className="text-xl font-black">نشست‌ها و مانیتورینگ حضور</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-right">
                 <thead className="bg-slate-50 dark:bg-white/5 text-[9px] font-black text-muted uppercase tracking-widest">
                    <tr>
                       <th className="p-6">ادمین</th>
                       <th className="p-6">ورود</th>
                       <th className="p-6">خروج</th>
                       <th className="p-6">مدت زمان نشست</th>
                       <th className="p-6">وضعیت</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-muted/10">
                    {adminSessions.map(session => (
                      <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                         <td className="p-6 font-black text-xs">{session.adminName}</td>
                         <td className="p-6 text-[10px] font-bold" dir="ltr">{toPersianDigitsGlobal(new Date(session.loginAt).toLocaleString('fa-IR'))}</td>
                         <td className="p-6 text-[10px] font-bold" dir="ltr">{session.logoutAt ? toPersianDigitsGlobal(new Date(session.logoutAt).toLocaleString('fa-IR')) : '---'}</td>
                         <td className="p-6 font-black text-brand text-xs">
                            {session.durationMinutes ? `${toPersianDigits(session.durationMinutes)} دقیقه` : session.status === 'ONLINE' ? 'در حال فعالیت...' : '---'}
                         </td>
                         <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${session.status === 'ONLINE' ? 'bg-green-500 text-white animate-pulse' : 'bg-slate-200 dark:bg-white/10 text-muted'}`}>
                               {session.status}
                            </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
