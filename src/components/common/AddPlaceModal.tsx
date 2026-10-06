import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlaceCategory } from '../../types';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({ isOpen, onClose }) => {
  const { language, governorates, addPlace, isAdmin } = useApp();
  const isAr = language === 'ar';

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [govId, setGovId] = useState(governorates[0]?.id || 'baghdad');
  const [cityAr, setCityAr] = useState('');
  const [cityEn, setCityEn] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('archaeological');
  const [eraAr, setEraAr] = useState('');
  const [eraEn, setEraEn] = useState('');
  const [shortDescAr, setShortDescAr] = useState('');
  const [descAr, setDescAr] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [ticketPriceAr, setTicketPriceAr] = useState('مجاني');
  const [hoursAr, setHoursAr] = useState('يومياً 08:00 ص - 05:00 م');
  const [durationAr, setDurationAr] = useState('ساعتان');
  const [lat, setLat] = useState('33.3152');
  const [lng, setLng] = useState('44.3661');
  const [isUnesco, setIsUnesco] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !shortDescAr.trim()) return;

    addPlace({
      slug: (nameEn || nameAr).toLowerCase().replace(/\s+/g, '-'),
      name_ar: nameAr,
      name_en: nameEn || nameAr,
      category,
      governorate_id: govId,
      city_ar: cityAr || 'العراق',
      city_en: cityEn || 'Iraq',
      address_ar: `${cityAr}، العراق`,
      address_en: `${cityEn || 'Iraq'}`,
      lat: parseFloat(lat) || 33.3152,
      lng: parseFloat(lng) || 44.3661,
      cover_image: coverImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      images: [
        coverImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
      ],
      short_description_ar: shortDescAr,
      short_description_en: shortDescAr,
      description_ar: descAr || shortDescAr,
      description_en: descAr || shortDescAr,
      history_ar: 'تاريخ موثق في التراث العراقي الأصيل.',
      history_en: 'Documented authentic Iraqi heritage.',
      era_civilization_ar: eraAr || 'تاريخي وتراثي',
      era_civilization_en: eraEn || 'Historic & Heritage',
      opening_hours_ar: hoursAr,
      opening_hours_en: 'Daily 8:00 AM - 5:00 PM',
      ticket_price_ar: ticketPriceAr,
      ticket_price_en: 'Standard Admission',
      best_time_ar: 'أكتوبر - أبريل',
      best_time_en: 'October - April',
      average_visit_duration_ar: durationAr,
      average_visit_duration_en: durationAr,
      rating: 5.0,
      ratings_count: 1,
      ratings_breakdown: { cleanliness: 5, organization: 5, accessibility: 5, historicalValue: 5, overall: 5 },
      features: {
        familyFriendly: true,
        kidsFriendly: true,
        parkingAvailable: true,
        restroomsAvailable: true,
        wheelchairAccessible: true,
        nearbyRestaurants: true,
        requiresTicket: ticketPriceAr !== 'مجاني'
      },
      unesco: isUnesco,
      sources: [{ name: 'الهيئة العامة للآثار والسياحة العراقية' }],
      views: 1,
      favorites_count: 0,
      shares_count: 0,
      featured: false,
      status: isAdmin ? 'published' : 'pending'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-stone-900 text-lg">
              {isAdmin 
                ? (isAr ? 'إضافة معلم سياحي جديد للنظام' : 'Add New Tourist Site')
                : (isAr ? 'اقتراح إضافة معلم سياحي جديد' : 'Suggest a New Site')}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-stone-900 text-lg">
              {isAr ? 'تم حفظ المعلم بنجاح!' : 'Site Successfully Added!'}
            </h4>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              {isAdmin 
                ? (isAr ? 'تم نشر المعلم فورياً في المنصة.' : 'The place has been published to the live platform.')
                : (isAr ? 'تم إرسال المعلم للمراجعة في لوحة الإدارة.' : 'The place has been submitted for editorial review.')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'اسم المكان بالعربية *' : 'Name in Arabic *'}
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={e => setNameAr(e.target.value)}
                  placeholder="مثال: جامع الخلفاء"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'اسم المكان بالإنجليزية' : 'Name in English'}
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={e => setNameEn(e.target.value)}
                  placeholder="e.g. Al-Khulafa Mosque"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'المحافظة *' : 'Governorate *'}
                </label>
                <select
                  value={govId}
                  onChange={e => setGovId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 bg-white"
                >
                  {governorates.map(g => (
                    <option key={g.id} value={g.id}>
                      {isAr ? g.name_ar : g.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'التصنيف *' : 'Category *'}
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 bg-white"
                >
                  <option value="archaeological">{isAr ? 'أثري وحضاري' : 'Archaeological'}</option>
                  <option value="religious">{isAr ? 'ديني ومزارات' : 'Religious'}</option>
                  <option value="historical">{isAr ? 'تاريخي وتراثي' : 'Historical'}</option>
                  <option value="natural">{isAr ? 'طبيعي وأهوار' : 'Natural'}</option>
                  <option value="cultural">{isAr ? 'متاحف ومراكز ثقافية' : 'Cultural'}</option>
                  <option value="entertainment">{isAr ? 'ترفيه وحدائق' : 'Entertainment'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'المدينة / المنطقة' : 'City / District'}
                </label>
                <input
                  type="text"
                  value={cityAr}
                  onChange={e => setCityAr(e.target.value)}
                  placeholder="مثال: الشورجة، بغداد"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isAr ? 'الحضارة أو العصر التاريخي' : 'Historical Era'}
                </label>
                <input
                  type="text"
                  value={eraAr}
                  onChange={e => setEraAr(e.target.value)}
                  placeholder="مثال: العصر العباسي (القرن العاشر)"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {isAr ? 'خط العرض (Latitude)' : 'Latitude'}
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={e => setLat(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {isAr ? 'خط الطول (Longitude)' : 'Longitude'}
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={e => setLng(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded bg-white"
                />
              </div>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isAr ? 'رابط صورة الغلاف (URL)' : 'Cover Image URL'}
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* Short & Full Description */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isAr ? 'نبذة مختصرة (سطران) *' : 'Short Summary *'}
              </label>
              <textarea
                required
                rows={2}
                value={shortDescAr}
                onChange={e => setShortDescAr(e.target.value)}
                placeholder={isAr ? 'نبذة تعريفية سريعة تظهر في بطاقة المعلم...' : 'Brief description...'}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isAr ? 'الوصف المفصل والمعلومات التاريخية' : 'Detailed Description & History'}
              </label>
              <textarea
                rows={4}
                value={descAr}
                onChange={e => setDescAr(e.target.value)}
                placeholder={isAr ? 'تفاصيل عمارة المكان، تاريخه، وأهميته التراثية...' : 'Full detailed text...'}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* UNESCO checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="unesco-check"
                checked={isUnesco}
                onChange={e => setIsUnesco(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-stone-300"
              />
              <label htmlFor="unesco-check" className="text-xs font-semibold text-stone-700 cursor-pointer">
                {isAr ? 'موقع مسجل ضمن التراث العالمي لليونسكو (UNESCO)' : 'UNESCO World Heritage Inscribed'}
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition shadow-md"
              >
                {isAr ? 'حفظ وإرسال المعلم' : 'Save & Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
