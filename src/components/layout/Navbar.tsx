import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { 
  Compass, 
  MapPin, 
  Map, 
  Bookmark, 
  Globe2, 
  ShieldCheck, 
  Bell, 
  Menu, 
  X, 
  Calendar, 
  BookOpen, 
  Award,
  Sparkles,
  Search,
  Bot,
  Download
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    favorites, 
    notifications, 
    markNotificationRead, 
    isAdmin, 
    toggleAdminMode,
    activeView, 
    setActiveView,
    setIsAiChatOpen
  } = useApp();

  const { isInstallable, install } = usePWAInstall();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isAr = language === 'ar';
  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { id: 'home', label_ar: 'الرئيسية', label_en: 'Home', icon: Compass },
    { id: 'explore', label_ar: 'استكشف المعالم', label_en: 'Explore Places', icon: Search },
    { id: 'governorates', label_ar: 'المحافظات (18)', label_en: 'Governorates', icon: MapPin },
    { id: 'map', label_ar: 'الخريطة التفاعلية', label_en: 'Interactive Map', icon: Map },
    { id: 'trips', label_ar: 'مخطط الرحلات', label_en: 'Trip Planner', icon: Calendar },
    { id: 'unesco', label_ar: 'التراث العالمي', label_en: 'UNESCO World Heritage', icon: Award },
    { id: 'guide', label_ar: 'دليل السفر', label_en: 'Travel Guide', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-amber-900/40 transition-all shadow-md">
      {/* Top Bar for announcement / quick emergency & admin notice */}
      <div className="bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 text-amber-200/90 text-xs py-1.5 px-4 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">
              {isAr ? 'المنصة الرقمية الرسمية للسياحة والتراث في جمهورية العراق' : 'Official Digital Tourism & Heritage Platform of Iraq'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-stone-300">
            <span className="hidden sm:inline">
              {isAr ? 'طوارئ السياحة: 104 / الإسعاف: 122' : 'Tourist Police: 104 / Ambulance: 122'}
            </span>
            <button
              onClick={toggleAdminMode}
              className={`text-xs px-2 py-0.5 rounded transition flex items-center gap-1 ${
                isAdmin 
                  ? 'bg-amber-500 text-stone-950 font-bold' 
                  : 'bg-stone-800 text-stone-300 hover:text-amber-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? (isAr ? 'وضع المسؤول نشط' : 'Admin Active') : (isAr ? 'دخول المشرف' : 'Admin Mode')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 border border-amber-400/40 text-stone-950 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-stone-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heritage text-xl sm:text-2xl font-bold tracking-tight text-amber-100 group-hover:text-amber-400 transition-colors">
                  {isAr ? 'دليل العراق السياحي' : 'Iraq Tourism Guide'}
                </span>
              </div>
              <span className="text-[11px] text-amber-300/70 tracking-wider">
                {isAr ? 'تاريخٌ يمتد لآلاف السنين' : 'Mesopotamia · Land of Civilizations'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveView(link.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{isAr ? link.label_ar : link.label_en}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Favorites, Notifications, Language, Admin Dashboard */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Favorites Icon */}
            <button
              onClick={() => setActiveView('favorites')}
              className="relative p-2 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition"
              title={isAr ? 'الأماكن المفضلة' : 'Favorites'}
            >
              <Bookmark className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition"
                title={isAr ? 'الإشعارات' : 'Notifications'}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
                )}
              </button>

              {/* Notifications Popover */}
              {notificationsOpen && (
                <div className={`absolute top-full mt-2 w-80 max-w-[90vw] bg-stone-900 border border-amber-900/60 rounded-xl shadow-2xl p-3 z-50 ${isAr ? 'left-0 sm:left-auto sm:right-0' : 'right-0 sm:right-auto sm:left-0'}`}>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 text-xs font-semibold text-amber-400">
                    <span>{isAr ? 'التنبيهات والإشعارات' : 'Notifications'}</span>
                    <span className="text-stone-400">{notifications.length}</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          setNotificationsOpen(false);
                        }}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer transition ${
                          n.read ? 'bg-stone-800/40 text-stone-400' : 'bg-stone-800 text-stone-200 border-r-2 border-amber-500'
                        }`}
                      >
                        <p className="font-bold text-amber-200 mb-1">{isAr ? n.title_ar : n.title_en}</p>
                        <p className="text-stone-300 text-[11px] leading-relaxed">{isAr ? n.message_ar : n.message_en}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-medium rounded-lg border border-stone-700 transition"
              title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'EN' : 'عربي'}</span>
            </button>

            {/* AI Tourist Guide Trigger */}
            <button
              onClick={() => setIsAiChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs rounded-lg transition shadow-md select-none"
              title={isAr ? 'مرشد الرافدين الذكي (Gemini + بحث Google)' : 'Mesopotamia AI Guide'}
            >
              <Bot className="w-4 h-4 text-stone-950" />
              <span className="hidden sm:inline">{isAr ? 'مرشد الرافدين AI' : 'AI Guide'}</span>
            </button>

            {/* PWA Install Button if browser supports it */}
            {isInstallable && (
              <button
                onClick={install}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shadow-md select-none"
                title={isAr ? 'تثبيت المنصة كتطبيق على جهازك' : 'Install PWA app'}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'تثبيت التطبيق' : 'Install App'}</span>
              </button>
            )}

            {/* Admin Dashboard shortcut if enabled */}
            {isAdmin && (
              <button
                onClick={() => setActiveView('admin')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeView === 'admin'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-amber-900/40 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveView(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-400 font-bold border-r-4 border-amber-500'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Icon className="w-5 h-5 opacity-80" />
                <span>{isAr ? link.label_ar : link.label_en}</span>
              </button>
            );
          })}
          {isAdmin && (
            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold bg-amber-500 text-stone-950 mt-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{isAr ? 'لوحة تحكم المسؤول (Admin Dashboard)' : 'Admin Dashboard'}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
