import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useApp } from '../../context/AppContext';
import { Download, X, Smartphone, WifiOff, Share, PlusSquare, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isOnline, install } = usePWAInstall();
  const { language } = useApp();
  const isAr = language === 'ar';

  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('pwa_prompt_dismissed') === 'true';
  });
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {/* 1. Offline Mode Alert Bar (appears whenever device loses connection) */}
      {!isOnline && (
        <div className="bg-amber-600 text-stone-950 font-bold px-4 py-2 text-xs flex items-center justify-center gap-2 shadow-md animate-fade-in z-50">
          <WifiOff className="w-4 h-4 text-stone-950" />
          <span>
            {isAr
              ? 'أنت تتصفح حالياً في وضع عدم الاتصال (Offline) · المعالم والرحلات المحفوظة متاحة بالكامل'
              : 'You are currently browsing offline · Saved places and itineraries remain accessible'}
          </span>
        </div>
      )}

      {/* 2. In-App Install Banner for Mobile & Desktop */}
      {!isInstalled && !dismissed && (isInstallable || isIOS) && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-amber-500/40 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shrink-0 border border-amber-400/50 shadow">
                <Sparkles className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <h4 className="font-heritage text-sm font-bold text-amber-200">
                  {isAr ? 'تثبيت دليل العراق السياحي' : 'Install Iraq Tourism Guide'}
                </h4>
                <p className="text-[11px] text-stone-300 leading-tight mt-0.5">
                  {isAr 
                    ? 'ثبت التطبيق على هاتفك لتصفح المعالم دون إنترنت ووصول فوري.'
                    : 'Install app to your home screen for instant offline access.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-stone-400 hover:text-white p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isAr ? 'تثبيت الآن' : 'Install App'}</span>
            </button>

            <button
              onClick={handleDismiss}
              className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition"
            >
              {isAr ? 'لاحقاً' : 'Later'}
            </button>
          </div>
        </div>
      )}

      {/* 3. Guided Installation Modal for iOS Safari */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-stone-900 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm">
                  {isAr ? 'تثبيت التطبيق على iPhone / iPad' : 'Install on iOS Safari'}
                </h3>
              </div>
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-stone-600">
              <p>
                {isAr
                  ? 'لتثبيت المنصة على شاشة هاتفك الرئيسية عبر متصفح Safari:'
                  : 'To add this app to your home screen using iOS Safari:'}
              </p>
              
              <div className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <span>
                  {isAr ? '1. اضغط على زر المشاركة (Share) في شريط متصفح Safari السفلي.' : '1. Tap the Share icon in the Safari bottom bar.'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <span>
                  {isAr ? '2. مرر للأسفل واختر "إضافة إلى الصفحة الرئيسية" (Add to Home Screen).' : '2. Scroll down and select "Add to Home Screen".'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition"
            >
              {isAr ? 'فهمت، شكراً' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
