"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { LOGO_SVG } from "../constants";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Send,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { toPersianDigitsGlobal } from "../utils/helpers";

const Footer: React.FC = () => {
  const { appearance } = useApp();
  const { footer } = appearance;

  return (
    <footer className="bg-white dark:bg-[#050515] pt-20 pb-12 border-t border-muted/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        {/* Value Propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {[
            {
              label: "ضمانت اصالت کالا",
              icon: ShieldCheck,
              desc: "۱۰۰٪ اورجینال",
            },
            { label: "ارسال اکسپرس", icon: Truck, desc: "سریع‌ترین زمان ممکن" },
            {
              label: "۷ روز مهلت تست",
              icon: RotateCcw,
              desc: "با خیال راحت بخرید",
            },
            {
              label: "پشتیبانی تخصصی",
              icon: Phone,
              desc: "۲۴ ساعته همراه شما",
            },
          ].map((v, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-brand mb-4 group-hover:scale-110 group-hover:bg-brand group-hover:text-primary transition-all shadow-sm">
                <v.icon size={28} />
              </div>
              <h4 className="text-[11px] font-black mb-1">{v.label}</h4>
              <p className="text-[9px] text-muted font-bold">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          <div className="lg:col-span-5 space-y-8">
            <div className="w-32">{LOGO_SVG}</div>
            <p className="text-sm font-medium leading-[2.2] text-primary/70 dark:text-white/60 text-justify">
              {toPersianDigitsGlobal(footer.aboutText)}
            </p>
            <div className="flex gap-4">
              <a
                href={`https://instagram.com/${footer.instagram.replace("@", "")}`}
                className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-muted hover:text-brand hover:bg-brand/10 transition-all">
                <Instagram size={20} />
              </a>
              <a
                href={`https://t.me/${footer.telegram.replace("@", "")}`}
                className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-muted hover:text-brand hover:bg-brand/10 transition-all">
                <Send size={20} />
              </a>
              <a
                href={`https://wa.me/${footer.whatsapp}`}
                className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-muted hover:text-brand hover:bg-brand/10 transition-all">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-brand">
              اطلاعات تماس و نشانی
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <span className="text-[11px] font-bold leading-relaxed">
                  {toPersianDigitsGlobal(footer.address)}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <span className="text-[11px] font-black">
                  {toPersianDigitsGlobal(footer.phone)}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <span className="text-[11px] font-bold">{footer.email}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-brand mb-8">
              نمادهای اعتماد
            </h4>
            <div className="flex gap-4">
              <div className="bg-white p-4 rounded-3xl border border-muted/10 w-24 h-24 flex items-center justify-center shadow-sm">
                <img
                  src="https://trustseal.enamad.ir/logo.aspx?id=123&p=123"
                  className="w-full grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </div>
              <div className="bg-white p-4 rounded-3xl border border-muted/10 w-24 h-24 flex items-center justify-center shadow-sm">
                <ShieldCheck size={40} className="text-muted/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-muted/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-muted uppercase tracking-[2px]">
            {toPersianDigitsGlobal(footer.copyright)}
          </p>
          <div className="flex gap-8 text-[9px] font-black text-muted uppercase tracking-widest">
            <a href="#" className="hover:text-brand transition-colors">
              قوانین و مقررات
            </a>
            <a href="#" className="hover:text-brand transition-colors">
              حریم خصوصی
            </a>
            <a href="#" className="hover:text-brand transition-colors">
              نقشه سایت
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
