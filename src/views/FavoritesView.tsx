import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlaceCard } from '../components/places/PlaceCard';
import { Bookmark, CheckCircle2, Compass } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { language, places, favorites, visitedPlaces, setActiveView } = useApp();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'favorites' | 'visited'>('favorites');

  const favoritedPlaces = places.filter(p => favorites.includes(p.id));
  const visitedPlacesList = places.filter(p => visitedPlaces.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
      {/* Title & Tabs */}
      <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heritage text-3xl sm:text-4xl font-bold text-stone-900">
            {isAr ? 'الأماكن المحفوظة وسجل الزيارات' : 'Saved Places & Visit History'}
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            {isAr ? 'إدارة وجهاتك المفضلة والمعالم التي قمت بزيارتها' : 'Manage your bookmarked attractions and travel history'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'favorites' ? 'bg-white shadow text-stone-900' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{isAr ? `المفضلة (${favoritedPlaces.length})` : `Favorites (${favoritedPlaces.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('visited')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'visited' ? 'bg-white shadow text-stone-900' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isAr ? `تمت الزيارة (${visitedPlacesList.length})` : `Visited (${visitedPlacesList.length})`}</span>
          </button>
        </div>
      </div>

      {/* Places Display */}
      {activeTab === 'favorites' ? (
        favoritedPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {favoritedPlaces.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
            <Bookmark className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-800 text-base">
              {isAr ? 'لم تقم بحفظ أي معالم بعد' : 'No saved places yet'}
            </h3>
            <p className="text-xs text-stone-500">
              {isAr ? 'تصفح المعالم واضغط على زر الحفظ للرجوع إليها لاحقاً.' : 'Browse places and tap the bookmark icon to save them.'}
            </p>
            <button
              onClick={() => setActiveView('explore')}
              className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {isAr ? 'استكشف المعالم الآن' : 'Explore Places'}
            </button>
          </div>
        )
      ) : (
        visitedPlacesList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {visitedPlacesList.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-800 text-base">
              {isAr ? 'لم تقم بتسجيل أي زيارات بعد' : 'No recorded visits yet'}
            </h3>
            <p className="text-xs text-stone-500">
              {isAr ? 'افتح صفحة أي معلم قمت بزيارته واضغط "سجل زيارتي".' : 'Mark places as visited to track your adventures across Iraq.'}
            </p>
          </div>
        )
      )}
    </div>
  );
};
