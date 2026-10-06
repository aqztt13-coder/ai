import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlaceCard } from '../components/places/PlaceCard';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { EVENTS, ARTICLES } from '../data/extraData';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Compass, 
  Award, 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle, 
  Globe2,
  BookOpen
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { language, places, governorates, categories, setActiveView } = useApp();
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const featuredPlaces = places.filter(p => p.featured && p.status === 'published');
  const unescoPlaces = places.filter(p => p.unesco && p.status === 'published');

  // Filtered auto-suggestions
  const searchSuggestions = searchQuery.trim().length > 1
    ? places
        .filter(p =>
          p.name_ar.includes(searchQuery) ||
          p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.city_ar.includes(searchQuery) ||
          p.era_civilization_ar.includes(searchQuery)
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('explore');
    }
  };

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] sm:min-h-[660px] flex items-center justify-center -mt-4 sm:-mt-6 rounded-b-3xl sm:rounded-b-[40px] overflow-hidden bg-stone-950 text-white shadow-2xl">
        {/* Hero Background with Mesopotamian majestic overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=85"
            alt="Mesopotamia Iraq"
            className="w-full h-full object-cover object-center brightness-75 scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-black/30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-12 pb-16">
          
          {/* Subtle cultural badge (anti-slop, clean typography) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'بلاد الرافدين · مهد الحضارات الإنسانية' : 'Mesopotamia · The Cradle of Civilization'}</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-heritage text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-amber-50 leading-[1.15] drop-shadow-md">
            {isAr ? 'اكتشف العراق' : 'Discover Iraq'}
          </h1>

          <p className="max-w-2xl mx-auto text-stone-200 text-sm sm:text-lg leading-relaxed font-light drop-shadow">
            {isAr
              ? 'رحلة واحدة تكشف لك آلاف السنين من الحضارة السومرية والبابلية والآشورية والإسلامية، من أهوار الجنوب الساحرة إلى قمم كوردستان الشامخة.'
              : 'A single journey through millenniums of Sumerian, Babylonian, Assyrian, and Islamic heritage — from the southern marshes to the northern peaks.'}
          </p>

          {/* Main Intelligent Search Bar */}
          <div className="max-w-2xl mx-auto relative mt-8">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-2xl">
              <div className="absolute inset-y-0 right-0 pr-4 pl-4 flex items-center pointer-events-none text-amber-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن معلم، مدينة، موقع أثري أو ديني (مثل: زقورة أور، بابل، الأهوار)...' : 'Search for places, cities, heritage sites (e.g. Babylon, Ur, Marshes)...'}
                className="w-full pr-12 pl-32 py-4 sm:py-4.5 bg-white/95 backdrop-blur-md rounded-2xl text-stone-900 text-sm sm:text-base placeholder-stone-400 border-2 border-amber-500/50 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition shadow-inner"
              />
              <button
                type="submit"
                className={`absolute ${isAr ? 'left-2' : 'right-2'} px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-md`}
              >
                {isAr ? 'بحث' : 'Search'}
              </button>
            </form>

            {/* Live Search Auto-suggestions Dropdown */}
            {searchSuggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-30 text-stone-900 text-right">
                {searchSuggestions.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setActiveView('place-detail', p.id)}
                    className="p-3 hover:bg-amber-50 rounded-xl cursor-pointer flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.cover_image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-stone-900">{isAr ? p.name_ar : p.name_en}</div>
                        <div className="text-[11px] text-stone-500">{isAr ? p.city_ar : p.city_en} · {isAr ? p.era_civilization_ar : p.era_civilization_en}</div>
                      </div>
                    </div>
                    <span className="text-xs text-amber-700 font-semibold">{isAr ? 'عرض المعلم ←' : 'View →'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 text-xs sm:text-sm">
            <button
              onClick={() => setActiveView('explore')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition shadow-lg flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>{isAr ? 'استكشف المعالم' : 'Explore Places'}</span>
            </button>
            <button
              onClick={() => setActiveView('governorates')}
              className="px-6 py-3 bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-amber-500/40 font-semibold rounded-xl transition backdrop-blur-md flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>{isAr ? 'المحافظات (18)' : 'Governorates'}</span>
            </button>
            <button
              onClick={() => setActiveView('map')}
              className="px-6 py-3 bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-amber-500/40 font-semibold rounded-xl transition backdrop-blur-md flex items-center gap-2"
            >
              <Globe2 className="w-4 h-4" />
              <span>{isAr ? 'عرض الخريطة' : 'View Map'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-stone-900">
              {isAr ? 'تصنيفات المعالم السياحية' : 'Explore by Category'}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {isAr ? 'اكتشف العراق وفق اهتماماتك: دينية، أثرية، طبيعية وتراثية' : 'Curated categories spanning religions, antiquities, nature and culture'}
            </p>
          </div>
          <button
            onClick={() => setActiveView('explore')}
            className="text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>{isAr ? 'عرض الكل' : 'View all'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveView('explore');
              }}
              className="group p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-500/50 hover:shadow-lg transition-all text-center flex flex-col items-center justify-center space-y-2.5"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 group-hover:bg-amber-500 group-hover:text-stone-950 flex items-center justify-center transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-stone-800 group-hover:text-amber-800 transition line-clamp-1">
                {isAr ? cat.name_ar : cat.name_en}
              </h3>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PLACES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{isAr ? 'وجهات مختارة بعناية' : 'Handpicked Highlights'}</span>
            </div>
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-stone-900">
              {isAr ? 'أبرز معالم العراق السياحية' : 'Featured Tourist Attractions'}
            </h2>
          </div>
          <button
            onClick={() => setActiveView('explore')}
            className="text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>{isAr ? 'كل المعالم' : 'All places'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredPlaces.slice(0, 6).map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>

      {/* 4. UNESCO WORLD HERITAGE SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 rounded-3xl p-8 sm:p-12 text-white border border-amber-900/50 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
              <Award className="w-4 h-4" />
              <span>{isAr ? 'قائمة التراث العالمي لليونسكو' : 'UNESCO World Heritage List'}</span>
            </div>
            <h3 className="font-heritage text-2xl sm:text-4xl font-bold text-amber-100">
              {isAr ? 'مواقع العراق ذات القيمة الإنسانية الاستثنائية' : 'Iraq Sites of Outstanding Universal Value'}
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'يحتضن العراق 6 مواقع مسجلة على لائحة التراث العالمي: مدينة بابل الأثرية، زقورة أور والمقابر الملكية، مملكة الحضر، مدينة سامراء والملوية، أهوار جنوب العراق الطبيعية، وقلعة أربيل التاريخية.'
                : 'Iraq is home to premier UNESCO-inscribed cultural and natural sanctuaries representing humanity earliest civilizations.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveView('unesco')}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg flex items-center gap-2"
              >
                <span>{isAr ? 'استكشف مواقع التراث العالمي' : 'Explore UNESCO Sites'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE MAP SECTION PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-stone-900">
              {isAr ? 'خريطة العراق السياحية التفاعلية' : 'Interactive Map of Iraq'}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {isAr ? 'تصفح المعالم موزعة جغرافياً واستكشف المواقع القريبة منك' : 'Navigate places geographically and discover nearby sites'}
            </p>
          </div>
          <button
            onClick={() => setActiveView('map')}
            className="text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>{isAr ? 'فتح الخريطة الكاملة' : 'Full map'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        <InteractiveMap places={places} heightClass="h-[480px]" />
      </section>

      {/* 6. POPULAR GOVERNORATES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-stone-900">
              {isAr ? 'محافظات العراق (18 محافظة)' : 'Governorates of Iraq'}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {isAr ? 'لكل محافظة طابعها الخاص وتاريخها الفريد ومعالمها المميزة' : 'Each governorate with its unique culture, cuisine, and history'}
            </p>
          </div>
          <button
            onClick={() => setActiveView('governorates')}
            className="text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>{isAr ? 'جميع المحافظات' : 'All governorates'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {governorates.slice(0, 6).map(gov => {
            const placesInGov = places.filter(p => p.governorate_id === gov.id);
            return (
              <div
                key={gov.id}
                onClick={() => setActiveView('governorate-detail', gov.id)}
                className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md border border-stone-200"
              >
                <img
                  src={gov.cover_image}
                  alt={isAr ? gov.name_ar : gov.name_en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-heritage text-lg font-bold group-hover:text-amber-300 transition">
                    {isAr ? gov.name_ar : gov.name_en}
                  </h3>
                  <div className="text-[11px] text-stone-300">
                    {placesInGov.length} {isAr ? 'معالم موثقة' : 'places'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. RECOMMENDED TRIPS & ITINERARIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-stone-900">
              {isAr ? 'خطط الرحلات المقترحة' : 'Curated Itineraries'}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {isAr ? 'برامج سياحية متكاملة مصممة من قبل خبراء التراث العراقي' : 'Expert-designed multi-day itineraries across Iraqi regions'}
            </p>
          </div>
          <button
            onClick={() => setActiveView('trips')}
            className="text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>{isAr ? 'مخطط الرحلات الكامل' : 'Trip Planner'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => setActiveView('trips')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-500/50 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-semibold text-amber-700 mb-2">
                {isAr ? 'يومان · بغداد التاريخية' : '2 Days · Historic Baghdad'}
              </div>
              <h3 className="font-heritage text-lg font-bold text-stone-900 mb-2">
                {isAr ? 'رحلة بغداد: عبق الخلافة والذاكرة الرافدينية' : 'Baghdad: Caliphate & Mesopotamian Memory'}
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                {isAr
                  ? 'المتحف العراقي، شارع المتنبي، مقهى الشابندر، المدرسة المستنصرية وسوق السراي.'
                  : 'The Iraq National Museum, Mutanabbi Street, Shabandar Cafe, and Mustansiriya Madrasa.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>{isAr ? 'عرض جدول الرحلة ←' : 'View Itinerary →'}</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('trips')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-500/50 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-semibold text-amber-700 mb-2">
                {isAr ? '3 أيام · الجنوب والأهوار' : '3 Days · South & Marshes'}
              </div>
              <h3 className="font-heritage text-lg font-bold text-stone-900 mb-2">
                {isAr ? 'طريق سومر العظيم: من الزقورة إلى الأهوار' : 'The Great Sumer Road: Ur to Marshes'}
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                {isAr
                  ? 'زقورة أور، مدينة الوركاء (مهد الكتابة)، وجولة المشحوف في أهوار الجبايش الساحرة.'
                  : 'Ziggurat of Ur, ancient Uruk, and Mashhoof canoe sailing across the Chibayish marshes.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>{isAr ? 'عرض جدول الرحلة ←' : 'View Itinerary →'}</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('trips')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-500/50 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-semibold text-amber-700 mb-2">
                {isAr ? '3 أيام · إقليم كوردستان' : '3 Days · Kurdistan'}
              </div>
              <h3 className="font-heritage text-lg font-bold text-stone-900 mb-2">
                {isAr ? 'جواهر الشمال: قلعة أربيل والعمادية وتلفريك كورك' : 'Northern Jewels: Erbil, Amedi & Korek'}
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                {isAr
                  ? 'قلعة أربيل القديمة، سوق القيصرية، صعود جبل كورك بالتلفريك، والعمادية المعلقة.'
                  : 'Ancient Erbil Citadel, Qaysari Bazaar, Korek Mountain cable car, and clifftop Amedi.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>{isAr ? 'عرض جدول الرحلة ←' : 'View Itinerary →'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. UPCOMING EVENTS & CULTURAL FESTIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-stone-900">
              {isAr ? 'الفعاليات والمهرجانات السياحية' : 'Festivals & Events'}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {isAr ? 'أهم الأنشطة والمهرجانات التراثية والثقافية في المحافظات' : 'Cultural, traditional and seasonal festivals across Iraqi cities'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EVENTS.map(event => (
            <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm flex flex-col">
              <div className="h-44 overflow-hidden relative">
                <img src={event.cover_image} alt="" className="w-full h-full object-cover" />
                <div className="absolute bottom-2.5 right-2.5 bg-stone-950/80 text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md">
                  {isAr ? event.date_ar : event.date_en}
                </div>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">{isAr ? event.title_ar : event.title_en}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isAr ? event.location_ar : event.location_en}</span>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed line-clamp-2">
                    {isAr ? event.description_ar : event.description_en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. ARTICLES & TRAVEL BLOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-stone-900">
              {isAr ? 'مدونة السائح في العراق' : 'Travel Blog & Articles'}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {isAr ? 'مقالات وأدلة موثقة عن تاريخ الآثار وثقافة المدن العراقية' : 'Curated guides and documented histories about Mesopotamian heritage'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES.map(art => (
            <div key={art.id} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-5 items-center">
              <img src={art.cover_image} alt="" className="w-full sm:w-36 h-36 rounded-xl object-cover shrink-0" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-amber-800 font-semibold">
                  <span>{isAr ? art.category_ar : art.category_en}</span>
                  <span>·</span>
                  <span>{isAr ? art.read_time_ar : art.read_time_en}</span>
                </div>
                <h3 className="font-heritage text-base sm:text-lg font-bold text-stone-900 leading-snug">
                  {isAr ? art.title_ar : art.title_en}
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed line-clamp-2">
                  {isAr ? art.excerpt_ar : art.excerpt_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
