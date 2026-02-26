
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MapPin, X, Loader2, ExternalLink, Navigation } from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';

interface Branch {
  title: string;
  uri: string;
}

const BranchFinder: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [error, setError] = useState<string | null>(null);

  const findNearbyBranches = async () => {
    setLoading(true);
    setError(null);
    setBranches([]);

    try {
      if (!navigator.geolocation) {
        throw new Error("مرورگر شما از مکان‌یابی پشتیبانی نمی‌کند.");
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: "لیست ۵ فروشگاه موبایل و مرکز خدمات معتبر در نزدیکی این مختصات را پیدا کن.",
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: { latitude, longitude }
              }
            }
          },
        });

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          const foundBranches = chunks
            .filter((c: any) => c.maps)
            .map((c: any) => ({
              title: c.maps.title,
              uri: c.maps.uri
            }));
          setBranches(foundBranches);
        } else {
          setError("نتیجه‌ای یافت نشد. لطفا دوباره تلاش کنید.");
        }
        setLoading(false);
      }, (err) => {
        setError("دسترسی به مکان رد شد یا خطایی رخ داد.");
        setLoading(false);
      });
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />
      <div className="glass island relative w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 shadow-2xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent">
              <MapPin size={24} />
            </div>
            <h2 className="text-xl font-black">شعب و مراکز نزدیک من</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          {branches.length === 0 && !loading && !error && (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Navigation size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-500 mb-8 font-medium">برای یافتن مراکز خدمات و شعب وب‌قاب در نزدیکی خود، دکمه زیر را لمس کنید.</p>
              <button 
                onClick={findNearbyBranches}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl flex items-center gap-2 mx-auto"
              >
                جستجوی مراکز نزدیک
              </button>
            </div>
          )}

          {loading && (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-accent" size={48} />
              <p className="font-bold text-slate-400 animate-pulse">در حال جستجو روی نقشه...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {branches.map((branch, idx) => (
              <div key={idx} className="glass island p-4 flex items-center justify-between border-slate-100 dark:border-slate-800 hover:border-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-black">
                    {toPersianDigits(idx + 1)}
                  </div>
                  <span className="font-bold text-sm">{branch.title}</span>
                </div>
                <a 
                  href={branch.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-accent/10 text-accent p-2 rounded-xl hover:bg-accent hover:text-white transition-all"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchFinder;
