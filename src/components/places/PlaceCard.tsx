import React from 'react';
import { Place } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateDistanceKm, formatDistance } from '../../utils/distance';
import { Star, MapPin, Clock, Bookmark, Heart, CalendarPlus, Compass } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  onSelect?: (place: Place) => void;
  onAddToTrip?: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onSelect, onAddToTrip }) => {
  const { language, favorites, toggleFavorite, userLocation, setActiveView, governorates } = useApp();
  const isAr = language === 'ar';

  const isFavorited = favorites.includes(place.id);
  const gov = governorates.find(g => g.id === place.governorate_id);

  const distanceKm = userLocation
    ? calculateDistanceKm(userLocation.lat, userLocation.lng, place.lat, place.lng)
    : null;

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Cover Image Container */}
      <div className="relative h-56 sm:h-60 overflow-hidden bg-stone-100 cursor-pointer" onClick={() => setActiveView('place-detail', place.id)}>
        <img
          src={place.cover_image}
          alt={isAr ? place.name_ar : place.name_en}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/icon.svg';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-black/20" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(place.id);
          }}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3.5 ${isAr ? 'left-3.5' : 'right-3.5'} w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md ${
            isFavorited
              ? 'bg-amber-500 text-stone-950 scale-105'
              : 'bg-stone-900/60 text-white hover:bg-stone-900/80 hover:text-amber-400'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-stone-950' : ''}`} />
        </button>

        {/* UNESCO indicator (clean subtle stamp, not pill) */}
        {place.unesco && (
          <div className={`absolute top-3.5 ${isAr ? 'right-3.5' : 'left-3.5'} text-[11px] font-semibold text-amber-300 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-500/40 flex items-center gap-1`}>
            <span>{isAr ? 'تراث عالمي (يونسكو)' : 'UNESCO World Heritage'}</span>
          </div>
        )}

        {/* Overlay Bottom metadata */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-medium drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? (gov?.name_ar || place.city_ar) : (gov?.name_en || place.city_en)}</span>
          </div>
          {distanceKm !== null && (
            <span className="text-amber-300 font-semibold drop-shadow-sm">
              {formatDistance(distanceKm, isAr)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata line without pills */}
          <div className="flex items-center gap-2 text-xs text-stone-700 font-semibold mb-2">
            <span>{isAr ? place.era_civilization_ar : place.era_civilization_en}</span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <div className="flex items-center gap-1 text-amber-700">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-bold">{place.rating}</span>
              <span className="text-stone-500 text-[11px]">({place.ratings_count})</span>
            </div>
          </div>

          {/* Place Title */}
          <h3 
            onClick={() => setActiveView('place-detail', place.id)}
            className="font-heritage text-lg sm:text-xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors cursor-pointer line-clamp-1"
          >
            {isAr ? place.name_ar : place.name_en}
          </h3>

          {/* Short Description */}
          <p className="mt-2 text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
            {isAr ? place.short_description_ar : place.short_description_en}
          </p>
        </div>

        {/* Bottom Actions and Visit Duration */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-stone-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-stone-600" />
            <span className="truncate max-w-[120px]">{isAr ? place.average_visit_duration_ar : place.average_visit_duration_en}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (onAddToTrip) {
                  onAddToTrip(place);
                } else {
                  setActiveView('trips');
                }
              }}
              title={isAr ? 'أضف إلى خطة الرحلة' : 'Add to Trip'}
              className="p-2 text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
            >
              <CalendarPlus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('place-detail', place.id)}
              className="px-3 py-1.5 bg-stone-900 hover:bg-amber-700 text-amber-100 hover:text-white text-xs font-semibold rounded-lg transition shadow-sm"
            >
              {isAr ? 'استكشف المعلم' : 'Details'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
