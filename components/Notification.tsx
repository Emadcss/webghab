
"use client";

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const Notification: React.FC = () => {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="fixed top-24 left-6 z-[2000] flex flex-col gap-3 max-w-sm w-full">
      {notifications.map((n) => (
        <div 
          key={n.id}
          className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between animate-slide-in backdrop-blur-md ${
            n.type === 'success' ? 'bg-green-500/90 border-green-400 text-white' :
            n.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' :
            'bg-brand/90 border-brand/40 text-primary'
          }`}
        >
          <div className="flex items-center gap-3">
            {n.type === 'success' ? <CheckCircle size={18} /> : 
             n.type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
            <span className="text-[11px] font-black">{n.message}</span>
          </div>
          <button onClick={() => removeNotification(n.id)} className="p-1 hover:bg-white/20 rounded-lg">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
