import React from 'react';
import { useApp } from '../context/AppContext';
import { PlaceCard } from '../components/places/PlaceCard';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { MapPin, Calendar, Compass, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export const GovernorateDetailView: React.FC = () => {
  const { language, governorates, selectedGovernorateId, places, setActiveView } = useApp();
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const gov = governorates.find(g => g.id === selectedGovernorateId) || governorates[0];
  const govPlaces = places.filter(p => p.governorate_id === gov.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-4">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveView('governorates')}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition"
        >
          <ArrowIcon className="w-4 h-4 rotate-180" />
          <span>{isAr ? 'العودة لجميع المحافظات' : 'Back to all governorates'}</span>
        </button>
      </div>

      {/* Hero Banner for Governorate */}
      <div className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[400px] flex items-end p-6 sm:p-10 shadow-xl bg-stone-900">
        <img
          src={gov.cover_image}
          alt={isAr ? gov.name_ar : gov.name_en}
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-black/20" />

        <div className="relative z-10 text-white max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-400/30 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>{isAr ? `إقليم: ${gov.region_ar}` : `Region: ${gov.region_en}`}</span>
          </div>

          <h1 className="font-heritage text-3xl sm:text-5xl font-extrabold text-amber-50">
            {isAr ? `محافظة ${gov.name_ar}` : `${gov.name_en} Governorate`}
          </h1>

          <p className="text-stone-200 text-xs sm:text-sm leading-relaxed">
            {isAr ? gov.description_ar : gov.description_en}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200/90 pt-1">
            <span className="flex items-center gap-1 font-semibold">
              <Calendar className="w-4 h-4 text-amber-400" />
              {isAr ? `أفضل وقت للزيارة: ${gov.best_time_ar}` : `Best time: ${gov.best_time_en}`}
            </span>
            <span>·</span>
            <span>{isAr ? `مركز المحافظة: ${gov.capital_ar}` : `Capital: ${gov.capital_en}`}</span>
          </div>
        </div>
      </div>

      {/* Governorate Highlights Tags */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{isAr ? 'أبرز معالم ورموز المحافظة' : 'Governorate Highlights'}</span>
        </h3>
        <div className="flex flex-wrap gap-2 text-xs">
          {(isAr ? gov.highlights_ar : gov.highlights_en).map((h, i) => (
            <span key={i} className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 font-medium border border-stone-200">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Places in this Governorate */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heritage text-2xl font-bold text-stone-900">
            {isAr ? `المعالم السياحية في ${gov.name_ar} (${govPlaces.length})` : `Tourist Sites in ${gov.name_en} (${govPlaces.length})`}
          </h2>
        </div>

        {govPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {govPlaces.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-2xl border border-stone-200 p-6 space-y-2">
            <Compass className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-xs text-stone-500">
              {isAr ? 'جاري توثيق المزيد من معالم هذه المحافظة في قاعدة البيانات.' : 'More places for this governorate are being documented.'}
            </p>
          </div>
        )}
      </div>

      {/* Interactive Map for this Governorate */}
      {govPlaces.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-heritage text-xl font-bold text-stone-900">
            {isAr ? `خريطة معالم ${gov.name_ar}` : `Map of ${gov.name_en}`}
          </h3>
          <InteractiveMap places={govPlaces} heightClass="h-[400px]" />
        </div>
      )}
    </div>
  );
};
