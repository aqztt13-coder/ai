import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AddPlaceModal } from '../components/common/AddPlaceModal';
import { 
  ShieldCheck, 
  MapPin, 
  PlusCircle, 
  Trash2, 
  Check, 
  X, 
  Star, 
  Eye, 
  FileText, 
  Calendar, 
  AlertCircle,
  TrendingUp,
  Bookmark,
  Database,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { 
  getCacheStorageStats, 
  warmAllPwaCaches, 
  clearOfflineCaches, 
  dispatchCacheError, 
  CacheStats 
} from '../serviceWorkerRegistration';
import { Place } from '../types';

export const AdminDashboardView: React.FC = () => {
  const { 
    language, 
    places, 
    updatePlace, 
    deletePlace, 
    governorates, 
    editSuggestions, 
    moderateSuggestion, 
    reviews, 
    trips, 
    setActiveView 
  } = useApp();

  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'places' | 'suggestions' | 'reviews' | 'pwa'>('places');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [isSyncingCache, setIsSyncingCache] = useState(false);
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'pwa') {
      refreshCacheStats();
    }
  }, [activeTab]);

  const refreshCacheStats = async () => {
    const stats = await getCacheStorageStats();
    setCacheStats(stats);
  };

  const handleManualSync = async () => {
    setIsSyncingCache(true);
    setCacheMessage(null);
    try {
      await warmAllPwaCaches();
      await refreshCacheStats();
      setCacheMessage(isAr ? 'تمت مزامنة الكاش بنجاح لكافة المعالم والصور.' : 'Cache synchronized successfully.');
    } catch {
      setCacheMessage(isAr ? 'تعذر إكمال المزامنة.' : 'Sync failed.');
    } finally {
      setIsSyncingCache(false);
    }
  };

  const handleTestErrorAlert = () => {
    dispatchCacheError({
      id: `sim-${Date.now()}`,
      type: 'NETWORK_SYNC_FAILED',
      target: 'places-data',
      message_ar: 'تنبيه اختباري: تعذر الاتصال بالخادم لتحديث بيانات المعالم. تم تفعيل النسخة المحفوظة محلياً لضمان استمرارية التصفح.',
      message_en: 'Test Alert: Could not sync fresh places from server. Offline copy active for seamless continuity.',
      timestamp: Date.now(),
      retry: async () => {
        await warmAllPwaCaches();
        return true;
      },
    });
  };

  const handleClearCache = async () => {
    if (window.confirm(isAr ? 'هل أنت متأكد من رغبتك في مسح كافة بيانات الكاش المؤقتة؟' : 'Are you sure you want to clear all offline caches?')) {
      await clearOfflineCaches();
      await refreshCacheStats();
      setCacheMessage(isAr ? 'تم مسح الكاش.' : 'Cache cleared.');
    }
  };

  // Stats calculation
  const totalViews = places.reduce((acc, p) => acc + p.views, 0);
  const pendingSuggestions = editSuggestions.filter(s => s.status === 'pending');

  const filteredPlaces = places.filter(p =>
    p.name_ar.includes(searchTerm) || p.name_en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
      {/* Admin Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-heritage text-3xl font-bold text-stone-900">
              {isAr ? 'لوحة تحكم المشرف (Admin Dashboard)' : 'Administrator Control Panel'}
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              {isAr ? 'إدارة المعالم، مراجعة الاقتراحات، ومتابعة إحصائيات المنصة' : 'Manage attractions, moderate suggestions, and track engagement'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isAr ? 'إضافة معلم جديد للنظام' : 'Add New Place'}</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-[11px] text-stone-500 font-semibold">{isAr ? 'إجمالي المعالم' : 'Total Places'}</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{places.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-[11px] text-stone-500 font-semibold">{isAr ? 'المحافظات' : 'Governorates'}</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{governorates.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-[11px] text-stone-500 font-semibold">{isAr ? 'إجمالي المشاهدات' : 'Total Views'}</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{totalViews.toLocaleString()}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-[11px] text-stone-500 font-semibold">{isAr ? 'التقييمات والمراجعات' : 'Reviews'}</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{reviews.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-[11px] text-stone-500 font-semibold">{isAr ? 'الرحلات المنشأة' : 'Saved Trips'}</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{trips.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-[11px] text-stone-500 font-semibold">{isAr ? 'اقتراحات معلقة' : 'Pending Edits'}</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{pendingSuggestions.length}</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('places')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'places' ? 'bg-stone-900 text-amber-300 shadow' : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isAr ? `إدارة المعالم (${places.length})` : `Places (${places.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'suggestions' ? 'bg-stone-900 text-amber-300 shadow' : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{isAr ? `اقتراحات التعديل (${editSuggestions.length})` : `Edit Suggestions (${editSuggestions.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'reviews' ? 'bg-stone-900 text-amber-300 shadow' : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>{isAr ? `المراجعات (${reviews.length})` : `Reviews (${reviews.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('pwa')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'pwa' ? 'bg-stone-900 text-amber-300 shadow' : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>{isAr ? 'الكاش والـ PWA' : 'PWA & Offline Cache'}</span>
        </button>
      </div>

      {/* Tab 1: Places Management */}
      {activeTab === 'places' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={isAr ? 'تصفية المعالم بالاسم...' : 'Filter places by name...'}
              className="px-3 py-2 text-xs border border-stone-200 rounded-xl w-64 bg-stone-50 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 pb-2">
                  <th className="py-3 px-3 font-semibold">{isAr ? 'المعلم' : 'Place'}</th>
                  <th className="py-3 px-3 font-semibold">{isAr ? 'المحافظة' : 'Gov'}</th>
                  <th className="py-3 px-3 font-semibold">{isAr ? 'التصنيف' : 'Category'}</th>
                  <th className="py-3 px-3 font-semibold">{isAr ? 'التقييم' : 'Rating'}</th>
                  <th className="py-3 px-3 font-semibold">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-3 font-semibold text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPlaces.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-3 flex items-center gap-2">
                      <img src={p.cover_image} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <div 
                          onClick={() => setActiveView('place-detail', p.id)}
                          className="font-bold text-stone-900 hover:text-amber-700 cursor-pointer"
                        >
                          {isAr ? p.name_ar : p.name_en}
                        </div>
                        <div className="text-[10px] text-stone-400">{p.era_civilization_ar}</div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-stone-700">
                      {p.city_ar}
                    </td>

                    <td className="py-3 px-3 text-stone-600">
                      {p.category}
                    </td>

                    <td className="py-3 px-3 font-bold text-amber-700">
                      ⭐ {p.rating} ({p.ratings_count})
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => updatePlace(p.id, { featured: !p.featured })}
                          className={`p-1.5 rounded-lg text-[10px] font-bold ${
                            p.featured ? 'bg-amber-500 text-stone-950' : 'bg-stone-100 text-stone-600'
                          }`}
                          title="Toggle Featured"
                        >
                          ★
                        </button>

                        <button
                          onClick={() => deletePlace(p.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="Delete Place"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Edit Suggestions Moderation */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          {editSuggestions.length > 0 ? (
            editSuggestions.map(sug => (
              <div key={sug.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900">{sug.place_name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      sug.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      sug.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {sug.status}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500">
                    {isAr ? 'نوع التعديل: ' : 'Type: '} {sug.suggestion_type} · {isAr ? 'المقترح: ' : 'By: '} {sug.user_name} ({sug.user_email})
                  </div>
                  <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200 mt-1">
                    "{sug.details}"
                  </p>
                </div>

                {sug.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moderateSuggestion(sug.id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isAr ? 'قبول واعتماد' : 'Approve'}</span>
                    </button>
                    <button
                      onClick={() => moderateSuggestion(sug.id, 'rejected')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{isAr ? 'رفض' : 'Reject'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-stone-400 bg-white rounded-2xl border border-stone-200">
              {isAr ? 'لا توجد اقتراحات تعديل حالياً.' : 'No edit suggestions.'}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Reviews Moderation */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-bold text-xs text-stone-900">{r.user_name} · ⭐ {r.rating}</div>
                <p className="text-xs text-stone-600">"{r.comment}"</p>
                <div className="text-[10px] text-stone-400">{r.created_at}</div>
              </div>
              <div className="text-xs text-emerald-600 font-bold">
                {r.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: PWA & Offline Cache Resilience */}
      {activeTab === 'pwa' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900 font-heritage flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-600" />
                <span>{isAr ? 'صحة التخزين المؤقت وتطبيق الـ PWA' : 'PWA Cache Health & Resilience'}</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {isAr
                  ? 'مراقبة حالة Service Worker، والتخزين الهجين (Cache-First للصور وNetwork-First للمعالم)، واختبار تنبيهات الأخطاء.'
                  : 'Monitor Service Worker, hybrid caching, and test failure notifications.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleManualSync}
                disabled={isSyncingCache}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCache ? 'animate-spin' : ''}`} />
                <span>{isSyncingCache ? (isAr ? 'جارِ المزامنة...' : 'Syncing...') : (isAr ? 'مزامنة الكاش يدوياً' : 'Sync Cache')}</span>
              </button>

              <button
                onClick={handleTestErrorAlert}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>{isAr ? 'محاكاة تنبيه الخطأ' : 'Test Error Alert'}</span>
              </button>
            </div>
          </div>

          {cacheMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{cacheMessage}</span>
            </div>
          )}

          {/* Cache Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="text-[11px] text-stone-500 font-semibold">{isAr ? 'حالة الـ Service Worker' : 'Service Worker'}</div>
              <div className="text-sm font-bold text-stone-900 mt-1 flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${cacheStats?.isServiceWorkerActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>{cacheStats?.isServiceWorkerActive ? (isAr ? 'نشط ويعمل' : 'Active & Controlling') : (isAr ? 'قيد التجهيز / مسجل' : 'Registered / Standby')}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="text-[11px] text-stone-500 font-semibold">{isAr ? 'المعالم المخزنة (Network-First)' : 'Places Data Cached'}</div>
              <div className="text-xl font-extrabold text-stone-900 mt-1">
                {cacheStats?.placesDataCount ?? '—'} <span className="text-xs font-normal text-stone-400">{isAr ? 'عنصر' : 'entries'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="text-[11px] text-stone-500 font-semibold">{isAr ? 'الصور المخزنة (Cache-First)' : 'Images Cached'}</div>
              <div className="text-xl font-extrabold text-stone-900 mt-1">
                {cacheStats?.imagesCount ?? '—'} <span className="text-xs font-normal text-stone-400">{isAr ? 'صورة' : 'images'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="text-[11px] text-stone-500 font-semibold">{isAr ? 'ملفات الواجهة الثابتة' : 'App Shell Assets'}</div>
              <div className="text-xl font-extrabold text-stone-900 mt-1">
                {cacheStats?.staticCount ?? '—'} <span className="text-xs font-normal text-stone-400">{isAr ? 'ملف' : 'files'}</span>
              </div>
            </div>
          </div>

          {/* Operational Policy Guide */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs text-stone-700">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>{isAr ? 'بروتوكول استمرارية تجربة المستخدم (Resilience Protocol)' : 'User Continuity Protocol'}</span>
            </h4>
            <p className="leading-relaxed">
              {isAr
                ? 'عند فشل أي طلب شبكي أو حدوث تعذر في تحديث الكاش، يتم تشغيل وحدة معالجة الأخطاء وبث تنبيه للمستخدم فوراً مع توفير زر "إعادة المحاولة"، بينما يستمر التطبيق تلقائياً في قراءة النسخة المحفوظة مسبقاً دون أي توقف أو شاشات خطأ بيضاء.'
                : 'Whenever network requests fail or cache write errors occur, the error module broadcasts an immediate alert with a retry button while the application gracefully continues serving previously saved offline data.'}
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleClearCache}
              className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
            >
              {isAr ? 'مسح بيانات الكاش (إعادة الضبط)' : 'Clear Cached Data'}
            </button>
          </div>
        </div>
      )}

      {/* Add Place Modal */}
      <AddPlaceModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
};
