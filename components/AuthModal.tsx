
"use client";

import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck, RefreshCw, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sanitizeInput } from '../utils/helpers';
import { ValidationRules } from '../utils/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'login' | 'register';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, addNotification } = useApp();
  const [step, setStep] = useState<AuthStep>('login');
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setName('');
      setEmail('');
      setPassword('');
    }
  }, [step, isOpen]);

  if (!isOpen) return null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = ValidationRules.required(name, 'نام و نام خانوادگی');
    const emailErr = ValidationRules.email(email);
    const passErr = ValidationRules.password(password);

    if (nameErr || emailErr || passErr) {
      setErrors({ name: nameErr, email: emailErr, password: passErr });
      return;
    }

    setIsLoading(true);
    const success = await register(name, sanitizeInput(email), password);
    setIsLoading(false);
    if (success) onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = ValidationRules.email(email);
    const passErr = ValidationRules.required(password, 'رمز عبور');

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setIsLoading(true);
    const success = await login(sanitizeInput(email), password);
    setIsLoading(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-[#000038] rounded-[40px] overflow-hidden shadow-2xl border border-white/10 animate-slide-in">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black mb-1">
                {step === 'login' ? 'ورود به سیستم' : 'عضویت جدید'}
              </h2>
              <p className="text-[10px] text-muted font-bold uppercase tracking-[2px]">دسترسی امن به وب‌قاب</p>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-muted hover:text-brand transition-colors">
              <X size={20} />
            </button>
          </div>

          <form className="space-y-5" onSubmit={step === 'login' ? handleLoginSubmit : handleRegisterSubmit} noValidate>
            {step === 'register' && (
              <div className="space-y-1">
                <div className="relative group">
                  <User className="absolute right-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="نام و نام خانوادگی" 
                    className={`w-full bg-slate-50 dark:bg-white/5 border border-transparent focus:border-brand rounded-2xl py-4 pr-14 pl-5 outline-none text-xs font-bold transition-all ${errors.name ? 'border-red-500/50 bg-red-500/5' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-[9px] text-red-500 font-bold pr-4">{errors.name}</p>}
              </div>
            )}

            <div className="space-y-1">
              <div className="relative group">
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="آدرس ایمیل" 
                  className={`w-full bg-slate-50 dark:bg-white/5 border border-transparent focus:border-brand rounded-2xl py-4 pr-14 pl-5 outline-none text-xs font-bold transition-all ${errors.email ? 'border-red-500/50 bg-red-500/5' : ''}`}
                />
              </div>
              {errors.email && <p className="text-[9px] text-red-500 font-bold pr-4">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور" 
                  className={`w-full bg-slate-50 dark:bg-white/5 border border-transparent focus:border-brand rounded-2xl py-4 pr-14 pl-5 outline-none text-xs font-bold transition-all ${errors.password ? 'border-red-500/50 bg-red-500/5' : ''}`}
                />
              </div>
              {errors.password && <p className="text-[9px] text-red-500 font-bold pr-4">{errors.password}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-brand text-primary py-5 rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={20}/> : (step === 'login' ? 'ورود هوشمند' : 'تایید و ثبت‌نام')} 
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <button 
            type="button" 
            onClick={() => setStep(step === 'login' ? 'register' : 'login')} 
            className="w-full text-center text-[11px] font-black text-muted hover:text-brand transition-colors mt-8"
          >
            {step === 'login' ? 'هنوز عضو وب‌قاب نشده‌اید؟ ' : 'قبلاً عضو شده‌اید؟ '}
            <span className="text-brand underline underline-offset-4">{step === 'login' ? 'ثبت‌نام کنید' : 'وارد شوید'}</span>
          </button>

          <div className="mt-12 flex items-center gap-4 opacity-30 justify-center">
             <ShieldCheck size={16} />
             <span className="text-[9px] font-black uppercase tracking-[3px]">تراکنش امن و رمزنگاری شده</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
