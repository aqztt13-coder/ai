import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm, formatDistance } from '../utils/distance';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { ShareModal } from '../components/common/ShareModal';
import { SuggestEditModal } from '../components/common/SuggestEditModal';
import { HOTELS, RESTAURANTS } from '../data/extraData';
import { 
  Star, 
  MapPin, 
  Clock, 
  Ticket, 
  Calendar, 
  Check, 
  X, 
  Bookmark, 
  Share2, 
  CalendarPlus, 
  AlertCircle, 
  ExternalLink, 
  Navigation, 
  BookOpen, 
  Heart, 
  Building2, 
  Utensils, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award,
  Bot
} from 'lucide-react';

export const PlaceDetailView: React.FC = () => {
  const { 
    language, 
    places, 
    selectedPlaceId, 
    favorites, 
    toggleFavorite, 
    visitedPlaces, 
    toggleVisited, 
    reviews, 
    addReview, 
    userLocation, 
    setActiveView, 
    governorates,
    trips,
    addPlaceToTrip,
    openAiChatWithPrompt
  } = useApp();

  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const place = places.find(p => p.id === selectedPlaceId) || places[0];
  const gov = governorates.find(g => g.id === place?.governorate_id);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [cleanlinessScore, setCleanlinessScore] = useState(5);
  const [orgScore, setOrgScore] = useState(5);
  const [accessScore, setAccessScore] = useState(5);
  const [histScore, setHistScore] = useState(5);
  const [overallScore, setOverallScore] = useState(5);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Trip selection state
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [tripAddedMessage, setTripAddedMessage] = useState(false);

  if (!place) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-xl font-bold">{isAr ? 'لم يتم العثور على المعلم المطلوب' : 'Place not found'}</h2>
        <button onClick={() => setActiveView('explore')} className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg">
          {isAr ? 'العودة للاستكشاف' : 'Back to explore'}
        </button>
      </div>
    );
  }

  const isFavorited = favorites.includes(place.id);
  const isVisited = visitedPlaces.includes(place.id);

  // Distance from user
  const distanceKm = userLocation
    ? calculateDistanceKm(userLocation.lat, userLocation.lng, place.lat, place.lng)
    : null;

  // Nearby attractions sorted by distance
  const nearbyPlaces = places
    .filter(p => p.id !== place.id)
    .map(p => ({
      place: p,
      distance: calculateDistanceKm(place.lat, place.lng, p.lat, p.lng)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 4);

  // Nearest Hotel & Restaurant
  const nearestHotel = HOTELS.find(h => h.governorate_id === place.governorate_id) || HOTELS[0];
  const nearestRestaurant = RESTAURANTS.find(r => r.governorate_id === place.governorate_id) || RESTAURANTS[0];

  // Reviews for this place
  const placeReviews = reviews.filter(r => r.place_id === place.id && r.status === 'approved');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    addReview({
      place_id: place.id,
      user_name: reviewName,
      rating: overallScore,
      ratings_breakdown: {
        cleanliness: cleanlinessScore,
        organization: orgScore,
        accessibility: accessScore,
        historicalValue: histScore,
        overall: overallScore
      },
      comment: reviewComment,
      visit_date: isAr ? 'مؤخراً' : 'Recently'
    });

    setReviewSuccess(true);
    setReviewComment('');
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  const handleAddToTrip = () => {
    if (selectedTripId) {
      addPlaceToTrip(selectedTripId, place.id);
      setTripAddedMessage(true);
      setTimeout(() => setTripAddedMessage(false), 3000);
    } else if (trips.length > 0) {
      addPlaceToTrip(trips[0].id, place.id);
      setTripAddedMessage(true);
      setTimeout(() => setTripAddedMessage(false), 3000);
    } else {
      setActiveView('trips');
    }
  };

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`, '_blank');
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-4">
      
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <button
          onClick={() => setActiveView('explore')}
          className="flex items-center gap-1.5 font-semibold text-stone-700 hover:text-amber-800 transition"
        >
          <ArrowIcon className="w-4 h-4 rotate-180" />
          <span>{isAr ? 'العودة إلى قائمة المعالم' : 'Back to explore'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span>{isAr ? gov?.name_ar : gov?.name_en}</span>
          <span>/</span>
          <span className="text-stone-800 font-bold">{isAr ? place.name_ar : place.name_en}</span>
        </div>
      </div>

      {/* Main Header & Image Gallery */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
              <span>{isAr ? place.era_civilization_ar : place.era_civilization_en}</span>
              {place.unesco && (
                <>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-amber-800">
                    <Award className="w-3.5 h-3.5" />
                    <span>{isAr ? `تراث عالمي (يونسكو ${place.unesco_year || ''})` : `UNESCO Site (${place.unesco_year || ''})`}</span>
                  </div>
                </>
              )}
            </div>
            
            <h1 className="font-heritage text-3xl sm:text-5xl font-extrabold text-stone-900 leading-tight">
              {isAr ? place.name_ar : place.name_en}
            </h1>
            <p className="text-sm text-stone-500 font-medium mt-1">
              {isAr ? place.name_en : place.name_ar} · {isAr ? place.address_ar : place.address_en}
            </p>
          </div>

          {/* User Action Buttons Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(place.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-sm ${
                isFavorited
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-stone-950' : ''}`} />
              <span>{isFavorited ? (isAr ? 'في المفضلة' : 'Bookmarked') : (isAr ? 'حفظ في المفضلة' : 'Favorite')}</span>
            </button>

            {/* Visited Mark */}
            <button
              onClick={() => toggleVisited(place.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-sm ${
                isVisited
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isVisited ? (isAr ? 'تمت الزيارة' : 'Visited') : (isAr ? 'سجل زيارتي' : 'Mark Visited')}</span>
            </button>

            {/* Share */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 flex items-center gap-2 transition shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>{isAr ? 'مشاركة' : 'Share'}</span>
            </button>

            {/* Suggest Edit */}
            <button
              onClick={() => setEditModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 flex items-center gap-1.5 transition"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{isAr ? 'اقتراح تعديل' : 'Suggest Edit'}</span>
            </button>

            {/* Ask AI Tourist Guide about this place */}
            <button
              onClick={() => openAiChatWithPrompt(isAr ? `أخبرني بالتفصيل عن تاريخ ${place.name_ar} في ${place.city_ar}، وأهم النصائح العملية وأفضل الأوقات لزيارته؟` : `Tell me about the history and visitor tips for ${place.name_en} in ${place.city_en}?`)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 flex items-center gap-1.5 transition shadow-sm"
              title={isAr ? 'اسأل المرشد الذكي عن هذا المعلم' : 'Ask AI Guide about this attraction'}
            >
              <Bot className="w-4 h-4 text-stone-950" />
              <span>{isAr ? 'اسأل المرشد الذكي AI' : 'Ask AI Guide'}</span>
            </button>
          </div>
        </div>

        {/* Gallery Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 h-[380px] sm:h-[480px] rounded-3xl overflow-hidden relative shadow-lg bg-stone-900">
            <img
              src={place.images[activeImageIndex] || place.cover_image}
              alt={isAr ? place.name_ar : place.name_en}
              className="w-full h-full object-cover"
            />
            {distanceKm !== null && (
              <div className="absolute bottom-4 right-4 bg-stone-950/80 backdrop-blur-md text-amber-300 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-amber-500/30">
                {isAr ? `يبعد عنك: ${formatDistance(distanceKm, isAr)}` : `Distance: ${formatDistance(distanceKm, isAr)}`}
              </div>
            )}
          </div>

          {/* Thumbnail column */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto">
            {place.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`h-24 sm:h-28 w-28 lg:w-full rounded-2xl overflow-hidden cursor-pointer border-2 shrink-0 transition ${
                  activeImageIndex === idx ? 'border-amber-500 shadow-md scale-95' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Info, Description, Location, Reviews, Nearby */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Detailed Content & History */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Facts Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-stone-200">
              <Clock className="w-4 h-4 text-amber-600 mb-1" />
              <div className="text-[11px] text-stone-500">{isAr ? 'أوقات الزيارة' : 'Hours'}</div>
              <div className="text-xs font-bold text-stone-900 mt-0.5">{isAr ? place.opening_hours_ar : place.opening_hours_en}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200">
              <Ticket className="w-4 h-4 text-amber-600 mb-1" />
              <div className="text-[11px] text-stone-500">{isAr ? 'رسوم الدخول' : 'Tickets'}</div>
              <div className="text-xs font-bold text-stone-900 mt-0.5">{isAr ? place.ticket_price_ar : place.ticket_price_en}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200">
              <Calendar className="w-4 h-4 text-amber-600 mb-1" />
              <div className="text-[11px] text-stone-500">{isAr ? 'أفضل وقت للزيارة' : 'Best Season'}</div>
              <div className="text-xs font-bold text-stone-900 mt-0.5">{isAr ? place.best_time_ar : place.best_time_en}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500 mb-1" />
              <div className="text-[11px] text-stone-500">{isAr ? 'التقييم العام' : 'Rating'}</div>
              <div className="text-xs font-bold text-stone-900 mt-0.5">⭐ {place.rating} / 5 ({place.ratings_count})</div>
            </div>
          </div>

          {/* Description & Historical Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="font-heritage text-2xl font-bold text-stone-900 mb-3">
                {isAr ? 'عن هذا المعلم' : 'About this Destination'}
              </h2>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {isAr ? place.description_ar : place.description_en}
              </p>
            </div>

            <div className="pt-6 border-t border-stone-100">
              <h3 className="font-heritage text-xl font-bold text-stone-900 mb-2">
                {isAr ? 'التاريخ والأهمية الحضارية' : 'History & Civilizational Significance'}
              </h3>
              <p className="text-stone-700 text-sm leading-relaxed">
                {isAr ? place.history_ar : place.history_en}
              </p>
            </div>

            {/* Religious / Cultural Detail if present */}
            {place.religion_detail_ar && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs sm:text-sm">
                <span className="font-bold">{isAr ? 'الطابع الروحي والديني: ' : 'Spiritual & Religious Heritage: '}</span>
                <span>{isAr ? place.religion_detail_ar : place.religion_detail_en}</span>
              </div>
            )}
          </div>

          {/* Visitor Facilities & Amenities Checklist */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <h3 className="font-heritage text-xl font-bold text-stone-900 mb-4">
              {isAr ? 'المرافق والتسهيلات المتوفرة للزوار' : 'Visitor Facilities & Accessibility'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                {place.features.familyFriendly ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-stone-400" />}
                <span>{isAr ? 'مناسب للعائلات' : 'Family Friendly'}</span>
              </div>
              <div className="flex items-center gap-2">
                {place.features.kidsFriendly ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-stone-400" />}
                <span>{isAr ? 'مناسب للأطفال' : 'Kids Friendly'}</span>
              </div>
              <div className="flex items-center gap-2">
                {place.features.parkingAvailable ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-stone-400" />}
                <span>{isAr ? 'مواقف سيارات متاحة' : 'Parking Available'}</span>
              </div>
              <div className="flex items-center gap-2">
                {place.features.restroomsAvailable ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-stone-400" />}
                <span>{isAr ? 'دورات مياه' : 'Restrooms'}</span>
              </div>
              <div className="flex items-center gap-2">
                {place.features.wheelchairAccessible ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-stone-400" />}
                <span>{isAr ? 'مجهز لذوي الإعاقة' : 'Wheelchair Accessible'}</span>
              </div>
              <div className="flex items-center gap-2">
                {place.features.nearbyRestaurants ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-stone-400" />}
                <span>{isAr ? 'مطاعم ومقاهي قريبة' : 'Nearby Dining'}</span>
              </div>
            </div>
          </div>

          {/* Interactive Map on Location */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heritage text-xl font-bold text-stone-900">
                  {isAr ? 'الموقع الجغرافي والإحداثيات' : 'Location & GPS'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {place.lat.toFixed(4)}, {place.lng.toFixed(4)} · {isAr ? place.address_ar : place.address_en}
                </p>
              </div>
              <button
                onClick={openGoogleMaps}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isAr ? 'Google Maps' : 'Google Maps'}</span>
              </button>
            </div>

            <InteractiveMap places={[place]} focusPlace={place} heightClass="h-[340px]" />
          </div>

          {/* Sources and Scientific References (Requirement #43) */}
          {place.sources && place.sources.length > 0 && (
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-800">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>{isAr ? 'المصادر والمراجع الموثقة للمعلومات' : 'Verified References & Sources'}</span>
              </div>
              <ul className="space-y-1 text-stone-600">
                {place.sources.map((src, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span>·</span>
                    {src.url ? (
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-amber-800 underline hover:text-amber-900">
                        {src.name} {src.publisher && `(${src.publisher})`}
                      </a>
                    ) : (
                      <span>{src.name} {src.publisher && `(${src.publisher})`}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Multi-Criteria Ratings & Reviews (Requirement #14 & #15) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-heritage text-2xl font-bold text-stone-900">
              {isAr ? 'تقييمات وتجارب الزوار' : 'Visitor Reviews & Multi-Criteria Ratings'}
            </h3>

            {/* Ratings Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-center">
              <div>
                <div className="text-[11px] text-stone-500">{isAr ? 'النظافة' : 'Cleanliness'}</div>
                <div className="font-bold text-stone-900 text-sm mt-0.5">⭐ {place.ratings_breakdown.cleanliness}</div>
              </div>
              <div>
                <div className="text-[11px] text-stone-500">{isAr ? 'التنظيم' : 'Organization'}</div>
                <div className="font-bold text-stone-900 text-sm mt-0.5">⭐ {place.ratings_breakdown.organization}</div>
              </div>
              <div>
                <div className="text-[11px] text-stone-500">{isAr ? 'سهولة الوصول' : 'Access'}</div>
                <div className="font-bold text-stone-900 text-sm mt-0.5">⭐ {place.ratings_breakdown.accessibility}</div>
              </div>
              <div>
                <div className="text-[11px] text-stone-500">{isAr ? 'القيمة التاريخية' : 'History'}</div>
                <div className="font-bold text-stone-900 text-sm mt-0.5">⭐ {place.ratings_breakdown.historicalValue}</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-[11px] text-stone-500">{isAr ? 'العام' : 'Overall'}</div>
                <div className="font-bold text-amber-800 text-sm mt-0.5">⭐ {place.ratings_breakdown.overall}</div>
              </div>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
              <h4 className="font-bold text-stone-800 text-sm">
                {isAr ? 'شارك تجربتك وقيم هذا المعلم' : 'Write a Review'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={e => setReviewName(e.target.value)}
                  placeholder={isAr ? 'اسمك الكريم...' : 'Your Name...'}
                  className="px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-amber-600"
                />

                <div className="flex items-center justify-between text-xs px-3 py-2 bg-white rounded-lg border border-stone-200">
                  <span className="text-stone-600">{isAr ? 'التقييم الإجمالي:' : 'Overall:'}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setOverallScore(star)}
                        className={`text-base ${overallScore >= star ? 'text-amber-500' : 'text-stone-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder={isAr ? 'اكتب انطباعك عن المعلم، الخدمات، وسهولة الوصول...' : 'Describe your visit...'}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-amber-600"
              />

              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition shadow-sm"
              >
                {isAr ? 'إرسال المراجعة' : 'Submit Review'}
              </button>

              {reviewSuccess && (
                <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? 'شكراً لك! تم نشر تقييمك بنجاح.' : 'Thank you! Your review has been posted.'}</span>
                </div>
              )}
            </form>

            {/* List of Reviews */}
            <div className="space-y-3">
              {placeReviews.length > 0 ? (
                placeReviews.map(r => (
                  <div key={r.id} className="p-4 rounded-xl bg-white border border-stone-200/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                          {r.user_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-stone-900">{r.user_name}</div>
                          <div className="text-[10px] text-stone-400">{r.visit_date || '2025'}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs font-bold">
                        ⭐ {r.rating} / 5
                      </div>
                    </div>
                    <p className="text-stone-600 text-xs leading-relaxed">
                      {r.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-stone-400 text-xs text-center py-4">
                  {isAr ? 'كن أول من يكتب تقييماً لهذا المعلم الرائع!' : 'Be the first to review this place!'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions, Nearby places, Hotels & Dining */}
        <div className="space-y-6">
          
          {/* Add to Trip Action Box */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 border border-amber-900/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
              <CalendarPlus className="w-5 h-5" />
              <span>{isAr ? 'إضافة إلى خطة الرحلة' : 'Add to Trip Planner'}</span>
            </div>
            <p className="text-stone-300 text-xs leading-relaxed">
              {isAr
                ? 'أضف هذا المعلم إلى جدول رحلتك القادمة واحصل على خط سير منظم وحساب للمسافات.'
                : 'Include this attraction in your custom itinerary and generate a day-by-day travel plan.'}
            </p>

            {trips.length > 0 && (
              <select
                value={selectedTripId}
                onChange={e => setSelectedTripId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-800 border border-stone-700 rounded-xl text-stone-200 focus:outline-none"
              >
                <option value="">{isAr ? 'اختر الرحلة...' : 'Select a trip...'}</option>
                {trips.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            )}

            <button
              onClick={handleAddToTrip}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition shadow-md"
            >
              {isAr ? 'أضف للرحلة الآن' : 'Add to Itinerary'}
            </button>

            {tripAddedMessage && (
              <div className="text-xs text-emerald-400 font-semibold text-center flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'تمت إضافة المعلم لرحلتك بنجاح!' : 'Added to your itinerary!'}</span>
              </div>
            )}
          </div>

          {/* Nearby Attractions (Haversine calculation) */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-heritage text-lg font-bold text-stone-900">
              {isAr ? 'معالم قريبة من هذا الموقع' : 'Nearby Attractions'}
            </h3>
            <div className="space-y-3">
              {nearbyPlaces.map(({ place: np, distance }) => (
                <div
                  key={np.id}
                  onClick={() => setActiveView('place-detail', np.id)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 cursor-pointer transition border border-transparent hover:border-stone-200"
                >
                  <img src={np.cover_image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-stone-900 truncate">
                      {isAr ? np.name_ar : np.name_en}
                    </h4>
                    <div className="text-[11px] text-stone-500 truncate mt-0.5">
                      {isAr ? np.city_ar : np.city_en} · ⭐ {np.rating}
                    </div>
                    <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
                      {formatDistance(distance, isAr)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearest Hotel */}
          {nearestHotel && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'أقرب فندق للإقامة' : 'Recommended Nearby Hotel'}</span>
              </div>
              <img src={nearestHotel.cover_image} alt="" className="w-full h-32 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-xs text-stone-900">{isAr ? nearestHotel.name_ar : nearestHotel.name_en}</h4>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {'★'.repeat(nearestHotel.stars)} · {isAr ? nearestHotel.price_range_ar : nearestHotel.price_range_en}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  {isAr ? nearestHotel.address_ar : nearestHotel.address_en}
                </div>
              </div>
            </div>
          )}

          {/* Nearest Restaurant */}
          {nearestRestaurant && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                <Utensils className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'أقرب مطعم سياحي' : 'Recommended Nearby Restaurant'}</span>
              </div>
              <img src={nearestRestaurant.cover_image} alt="" className="w-full h-32 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-xs text-stone-900">{isAr ? nearestRestaurant.name_ar : nearestRestaurant.name_en}</h4>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {isAr ? nearestRestaurant.cuisine_ar : nearestRestaurant.cuisine_en} · ⭐ {nearestRestaurant.rating}
                </div>
                <div className="text-[11px] text-amber-800 font-semibold mt-1">
                  {isAr ? `أشهر الأطباق: ${nearestRestaurant.famous_dish_ar}` : `Specialty: ${nearestRestaurant.famous_dish_en}`}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={isAr ? place.name_ar : place.name_en}
        text={isAr ? place.short_description_ar : place.short_description_en}
      />

      {/* Suggest Edit Modal */}
      <SuggestEditModal
        place={place}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </article>
  );
};
