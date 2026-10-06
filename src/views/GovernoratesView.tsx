import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, Compass, ArrowLeft, ArrowRight } from 'lucide-react';

export const GovernoratesView: React.FC = () => {
  const { language, governorates, places, setActiveView } = useApp();
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
      <div className="border-b border-stone-200 pb-6">
        <h1 className="font-heritage text-3xl sm:text-4xl font-bold text-stone-900">
          {isAr ? 'محافظات جمهورية العراق (18 محافظة)' : 'Governorates of Iraq (All 18 Provinces)'}
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-1">
          {isAr
            ? 'دليل شامل لكل محافظة عراقية: المعالم الأثرية، الطبيعة، الأماكن الدينية، وأفضل مواسم الزيارة.'
            : 'Comprehensive guide to every Iraqi province: heritage, nature, spiritual shrines, and local culture.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {governorates.map(gov => {
          const govPlaces = places.filter(p => p.governorate_id === gov.id);
          return (
            <div
              key={gov.id}
              onClick={() => setActiveView('governorate-detail', gov.id)}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={gov.cover_image}
                    alt={isAr ? gov.name_ar : gov.name_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white flex items-center justify-between">
                    <div>
                      <h2 className="font-heritage text-2xl font-bold group-hover:text-amber-300 transition">
                        {isAr ? gov.name_ar : gov.name_en}
                      </h2>
                      <div className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAr ? `المركز: ${gov.capital_ar}` : `Capital: ${gov.capital_en}`}</span>
                      </div>
                    </div>
                    <span className="text-xs bg-amber-500 text-stone-950 px-2.5 py-1 rounded-full font-bold">
                      {govPlaces.length} {isAr ? 'معالم' : 'places'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {isAr ? gov.description_ar : gov.description_en}
                  </p>

                  <div className="pt-2 text-xs text-stone-500 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isAr ? `أفضل وقت للزيارة: ${gov.best_time_ar}` : `Best time: ${gov.best_time_en}`}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs font-bold text-amber-800">
                  <span>{isAr ? 'استكشف معالم المحافظة' : 'Explore Governorates Places'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
