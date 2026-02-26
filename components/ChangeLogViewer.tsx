
import React, { useState, useEffect } from 'react';
import { ChangeLogEntry } from '../types';
import { History, X, Clock, CheckCircle2 } from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';

const ChangeLogViewer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<ChangeLogEntry[]>([]);

  useEffect(() => {
    fetch('./changelog.json')
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed left-6 bottom-32 md:bottom-10 z-40 bg-slate-900 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-all border border-slate-700"
      >
        <History size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="glass island relative w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="text-accent" />
                <h2 className="text-xl font-black">گزارش تغییرات سیستم (ChangeLog)</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {logs.map((log, i) => (
                <div key={log.version} className="relative">
                  {i !== logs.length - 1 && (
                    <div className="absolute right-[11px] top-8 bottom-[-40px] w-0.5 bg-slate-200 dark:bg-slate-800" />
                  )}
                  <div className="flex gap-6">
                    <div className="relative z-10 w-6 h-6 rounded-full bg-accent border-4 border-white dark:border-slate-900 shadow-sm mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold">نسخه {toPersianDigits(log.version)}</span>
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Clock size={14} />
                          <span>{toPersianDigits(log.timestamp)}</span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {log.changes.map((change, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangeLogViewer;
