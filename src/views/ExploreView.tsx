import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PlaceCard } from '../components/places/PlaceCard';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { AddPlaceModal } from '../components/common/AddPlaceModal';
import { 
  Search, 
  Filter, 
  MapPin, 
  Grid, 
  Map as MapIcon, 
  PlusCircle, 
  SlidersHorizontal,
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { PlaceCategory } from '../types';

export const ExploreView: React.FC = () => {
  const { language, places, governorates, categories } = useApp();
  const isAr = language === 'ar';

  const [search, setSearch] = useState('');
  const [selectedGov, setSelectedGov] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyUnesco, setOnlyUnesco] = useState(false);
  const [onlyFamily, setOnlyFamily] = useState(false);
  const [onlyFree, setOnlyFree] = useState(false);
  const [onlyWheelchair, setOnlyWheelchair] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'views' | 'name'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Filtered Places
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      // Search query
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchNameAr = place.name_ar.toLowerCase().includes(q);
        const matchNameEn = place.name_en.toLowerCase().includes(q);
        const matchCityAr = place.city_ar.toLowerCase().includes(q);
        const matchEra = place.era_civilization_ar.toLowerCase().includes(q);
        const matchDesc = place.short_description_ar.toLowerCase().includes(q);
        if (!matchNameAr && !matchNameEn && !matchCityAr && !matchEra && !matchDesc) {
          return false;
        }
      }

      // Governorate filter
      if (selectedGov !== 'all' && place.governorate_id !== selectedGov) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && place.category !== selectedCategory) {
        return false;
      }

      // Features
      if (onlyUnesco && !place.unesco) return false;
      if (onlyFamily && !place.features.familyFriendly) return false;
      if (onlyFree && place.features.requiresTicket) return false;
      if (onlyWheelchair && !place.features.wheelchairAccessible) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'views') return b.views - a.views;
      return a.name_ar.localeCompare(b.name_ar);
    });
  }, [places, search, selectedGov, selectedCategory, onlyUnesco, onlyFamily, onlyFree, onlyWheelchair, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedGov('all');
    setSelectedCategory('all');
    setOnlyUnesco(false);
    setOnlyFamily(false);
    setOnlyFree(false);
    setOnlyWheelchair(false);
  };

  const hasActiveFilters = 
    selectedGov !== 'all' || 
    selectedCategory !== 'all' || 
    onlyUnesco || 
    onlyFamily || 
    onlyFree || 
    onlyWheelchair || 
    Boolean(search.trim());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
      
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="font-heritage text-3xl sm:text-4xl font-bold text-stone-900">
            {isAr ? 'استكشف معالم العراق السياحية' : 'Explore All Iraq Attractions'}
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            {isAr 
              ? `عرض ${filteredPlaces.length} موقع ومعلم موثق في مختلف المحافظات`
              : `Showing ${filteredPlaces.length} documented attractions across all regions`}
          </p>
        </div>

        {/* View Mode & Add Place action */}
        <div className="flex items-center gap-3">
          {/* Grid / Map Switcher */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'grid' ? 'bg-white shadow text-stone-900' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>{isAr ? 'شبكة' : 'Grid'}</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'map' ? 'bg-white shadow text-stone-900' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>{isAr ? 'خريطة' : 'Map'}</span>
            </button>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isAr ? 'اقتراح معلم جديد' : 'Suggest Site'}</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        
        {/* Search Input & Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Query */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isAr ? 'ابحث باسم المعلم، المدينة...' : 'Search place, city, era...'}
              className="w-full pr-9 pl-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600"
            />
          </div>

          {/* Governorate Select */}
          <div>
            <select
              value={selectedGov}
              onChange={e => setSelectedGov(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600"
            >
              <option value="all">{isAr ? 'كل المحافظات (18)' : 'All Governorates'}</option>
              {governorates.map(g => (
                <option key={g.id} value={g.id}>{isAr ? g.name_ar : g.name_en}</option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600"
            >
              <option value="all">{isAr ? 'جميع التصنيفات' : 'All Categories'}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{isAr ? c.name_ar : c.name_en}</option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600"
            >
              <option value="rating">{isAr ? 'الأعلى تقييماً ⭐' : 'Highest Rated'}</option>
              <option value="views">{isAr ? 'الأكثر مشاهدة' : 'Most Viewed'}</option>
              <option value="name">{isAr ? 'الترتيب الأبجدي' : 'Alphabetical'}</option>
            </select>
          </div>
        </div>

        {/* Feature Checkbox Toggles & Clear */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 hover:text-stone-900">
              <input
                type="checkbox"
                checked={onlyUnesco}
                onChange={e => setOnlyUnesco(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span className="font-semibold text-amber-800">{isAr ? 'تراث عالمي (يونسكو)' : 'UNESCO Site'}</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 hover:text-stone-900">
              <input
                type="checkbox"
                checked={onlyFamily}
                onChange={e => setOnlyFamily(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span>{isAr ? 'مناسب للعائلات' : 'Family Friendly'}</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 hover:text-stone-900">
              <input
                type="checkbox"
                checked={onlyFree}
                onChange={e => setOnlyFree(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span>{isAr ? 'دخول مجاني' : 'Free Entry'}</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 hover:text-stone-900">
              <input
                type="checkbox"
                checked={onlyWheelchair}
                onChange={e => setOnlyWheelchair(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span>{isAr ? 'مجهز لذوي الإعاقة' : 'Wheelchair Accessible'}</span>
            </label>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-amber-800 hover:underline flex items-center gap-1 font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة ضبط الفلاتر' : 'Reset filters'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Grid or Map */}
      {viewMode === 'grid' ? (
        filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPlaces.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
            <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-800 text-base">
              {isAr ? 'لا توجد معالم تطابق معايير البحث الحالية' : 'No places found matching criteria'}
            </h3>
            <p className="text-xs text-stone-500">
              {isAr ? 'جرب تغيير خيارات الفلترة أو مسح كلمات البحث.' : 'Try adjusting the search query or reset the filters.'}
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-stone-900 text-amber-300 rounded-lg text-xs font-semibold"
            >
              {isAr ? 'إعادة ضبط الفلاتر' : 'Reset filters'}
            </button>
          </div>
        )
      ) : (
        <InteractiveMap places={filteredPlaces} heightClass="h-[600px]" />
      )}

      {/* Suggest Place Modal */}
      <AddPlaceModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
};
