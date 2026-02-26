
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Eye, Zap, CheckCircle } from 'lucide-react';
import { toPersianDigitsGlobal } from '../utils/helpers';

const SocialProofPopup: React.FC = () => {
  const { socialProofs } = useApp();
  const [activeProof, setActiveProof] = useState<any>(null);

  useEffect(() => {
    if (socialProofs.length > 0) {
      setActiveProof(socialProofs[0]);
    } else {
      setActiveProof(null);
    }
  }, [socialProofs]);

  if (!activeProof) return null;

  return (
    <div className="fixed bottom-32 right-6 z-[100] md:bottom-10 animate-slide-up">
       <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-brand/20 p-4 rounded-[28px] shadow-2xl flex items-center gap-4 max-w-xs ring-1 ring-white/10">
          <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center shrink-0">
             {activeProof.type === 'PURCHASE' ? <ShoppingBag size={20} /> : <Eye size={20} />}
          </div>
          <div className="flex-1">
             <p className="text-[10px] font-bold text-primary dark:text-white leading-relaxed">
                {toPersianDigitsGlobal(activeProof.message)}
             </p>
             <div className="flex items-center gap-1.5 mt-1.5">
                <CheckCircle size={10} className="text-green-500" />
                <span className="text-[8px] font-black text-muted uppercase tracking-widest">تایید شده توسط سیستم</span>
             </div>
          </div>
       </div>
    </div>
  );
};

export default SocialProofPopup;
