import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  subscribeToCacheErrors, 
  CacheErrorInfo, 
  retryFailedCacheSync 
} from '../../serviceWorkerRegistration';
import { AlertCircle, RefreshCw, X, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

export const CacheErrorAlert: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'ar';

  const [activeError, setActiveError] = useState<CacheErrorInfo | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retrySuccess, setRetrySuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCacheErrors((errorInfo) => {
      setActiveError(errorInfo);
      setRetrySuccess(false);

      // Auto-dismiss after 9 seconds if not interacted
      const timer = setTimeout(() => {
        setActiveError((current) => (current?.id === errorInfo.id ? null : current));
      }, 9000);

      return () => clearTimeout(timer);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDismiss = () => {
    setActiveError(null);
    setRetrySuccess(false);
  };

  const handleRetry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);

    try {
      let success = false;
      if (activeError?.retry) {
        success = await activeError.retry();
      } else {
        success = await retryFailedCacheSync();
      }

      if (success) {
        setRetrySuccess(true);
        setTimeout(() => {
          setActiveError(null);
          setRetrySuccess(false);
        }, 3200);
      }
    } catch (err) {
      console.warn('[CacheAlert] Retry encountered issue:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  if (!activeError) {
    return null;
  }

  return (
    <div 
      role="alert"
      aria-live="polite"
      className="fixed bottom-20 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-fade-in"
    >
      <div className="bg-stone-900/95 backdrop-blur-md text-stone-100 p-4 rounded-2xl shadow-2xl border border-amber-500/40 relative">
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
            {retrySuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400" />
            )}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold font-heritage text-amber-200">
                {retrySuccess
                  ? isAr ? 'تمت مزامنة الكاش بنجاح' : 'Cache Synchronized Successfully'
                  : isAr ? 'تنبيه تحديث الذاكرة المؤقتة (Cache)' : 'Cache Update Alert'}
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] text-stone-400">
                <Database className="w-3 h-3 text-amber-400/80" />
                <span>PWA</span>
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed mt-1">
              {retrySuccess ? (
                isAr 
                  ? 'تم تحديث كافة بيانات المعالم والصور في الكاش بنجاح، يمكنك التصفح بأمان.'
                  : 'All places data and assets have been synced to offline storage.'
              ) : (
                isAr ? activeError.message_ar : activeError.message_en
              )}
            </p>

            {/* Offline Safeguard Note */}
            {!retrySuccess && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-300/90 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  {isAr 
                    ? 'البيانات المحفوظة مسبقاً تعمل بكفاءة لضمان استمرارية التصفح دون انقطاع.' 
                    : 'Previously saved offline data remains fully operational.'}
                </span>
              </div>
            )}

            {/* Actions */}
            {!retrySuccess && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                  <span>
                    {isRetrying
                      ? isAr ? 'جارِ المزامنة...' : 'Syncing...'
                      : isAr ? 'إعادة المحاولة' : 'Retry Sync'}
                  </span>
                </button>

                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-lg transition cursor-pointer"
                >
                  {isAr ? 'متابعة التصفح' : 'Dismiss'}
                </button>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
