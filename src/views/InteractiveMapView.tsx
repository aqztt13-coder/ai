import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { MapPin, Navigation, Compass, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const InteractiveMapView: React.FC = () => {
  const { language, places, governorates, categories, setActiveView } = useApp();
  const isAr = language === 'ar';

  const [selectedGov, setSelectedGov] = useState<string>('all');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filteredPlaces = places.filter(p => {
    const matchGov = selectedGov === 'all' || p.governorate_id === selectedGov;
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    return matchGov && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="font-heritage text-3xl font-bold text-stone-900">
            {isAr ? 'خريطة العراق السياحية التفاعلية' : 'Interactive Map of Iraq'}
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            {isAr ? 'تصفح كل المعالم والمواقع الأثرية والمزارات في محافظات العراق' : 'Explore all tourist attractions, archaeological sites, and shrines'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 bg-stone-100 rounded-lg text-stone-700 font-bold">
            {filteredPlaces.length} {isAr ? 'معلم على الخريطة' : 'places visible'}
          </span>
        </div>
      </div>

      {/* Main Map */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <InteractiveMap 
            places={filteredPlaces} 
            selectedCategory={selectedCat}
            selectedGov={selectedGov}
            heightClass="h-[620px]" 
          />
        </div>

        {/* Places List Sidebar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col h-[620px]">
          <h3 className="font-bold text-stone-900 text-sm mb-3 pb-2 border-b border-stone-100">
            {isAr ? 'المعالم المعروضة' : 'Sites in view'}
          </h3>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {filteredPlaces.map(p => (
              <div
                key={p.id}
                onClick={() => setActiveView('place-detail', p.id)}
                className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/40 cursor-pointer transition flex items-center gap-3"
              >
                <img src={p.cover_image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-stone-900 truncate">
                    {isAr ? p.name_ar : p.name_en}
                  </h4>
                  <div className="text-[11px] text-stone-500 truncate mt-0.5">
                    {isAr ? p.city_ar : p.city_en} · ⭐ {p.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
