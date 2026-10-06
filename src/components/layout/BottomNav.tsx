import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Search, Map, Calendar, Bookmark, ShieldCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { language, activeView, setActiveView, favorites, isAdmin } = useApp();
  const isAr = language === 'ar';

  const navItems = [
    { id: 'home', label_ar: 'الرئيسية', label_en: 'Home', icon: Compass },
    { id: 'explore', label_ar: 'استكشف', label_en: 'Explore', icon: Search },
    { id: 'map', label_ar: 'الخريطة', label_en: 'Map', icon: Map },
    { id: 'trips', label_ar: 'الرحلات', label_en: 'Trips', icon: Calendar },
    { 
      id: isAdmin ? 'admin' : 'favorites', 
      label_ar: isAdmin ? 'الإدارة' : 'المفضلة', 
      label_en: isAdmin ? 'Admin' : 'Favorites', 
      icon: isAdmin ? ShieldCheck : Bookmark,
      badge: !isAdmin && favorites.length > 0 ? favorites.length : undefined
    }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-lg border-t border-amber-900/40 text-stone-300 py-1 px-2 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg relative transition-all ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">
                {isAr ? item.label_ar : item.label_en}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
