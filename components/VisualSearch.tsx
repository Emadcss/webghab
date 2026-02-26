
import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Sparkles, Scan } from 'lucide-react';

const VisualSearch: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      onClose();
      alert("قابلیت جستجوی هوشمند به زودی فعال می‌شود! تصویر شما با پایگاه داده محصولات وب‌قاب مطابقت داده شد.");
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
      <div className="relative w-full max-w-md aspect-[9/16] bg-black rounded-[48px] overflow-hidden shadow-2xl border-4 border-white/10">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover opacity-80"
        />
        
        {/* Overlay UI */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
          <div className="flex items-center justify-between pointer-events-auto">
            <button onClick={onClose} className="bg-white/10 backdrop-blur-md p-3 rounded-2xl text-white">
              <X size={24} />
            </button>
            <div className="bg-accent/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-accent/30 text-accent text-xs font-black">
              جستجوی تصویری زنده
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center">
             <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent/50 animate-[scan_2s_infinite]" />
                <style>{`
                  @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                  }
                `}</style>
             </div>
          </div>

          <div className="flex flex-col items-center gap-6 pointer-events-auto">
            {isAnalyzing ? (
              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl flex items-center gap-3">
                <Sparkles className="animate-pulse text-accent" />
                <span className="text-white font-bold text-sm">در حال تحلیل هوشمند تصویر...</span>
              </div>
            ) : (
              <>
                <p className="text-white/60 text-xs text-center font-medium">کالا را درون کادر قرار داده و دکمه را لمس کنید</p>
                <button 
                  onClick={handleCapture}
                  className="w-20 h-20 bg-white rounded-full p-1 border-4 border-accent shadow-2xl active:scale-90 transition-transform flex items-center justify-center"
                >
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center">
                    <Scan size={32} className="text-primary" />
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualSearch;
