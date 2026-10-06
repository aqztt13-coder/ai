import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Printer, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Share2
} from 'lucide-react';

export const TripsView: React.FC = () => {
  const { language, trips, addTrip, deleteTrip, places, setActiveView } = useApp();
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeTripId, setActiveTripId] = useState<string>(trips[0]?.id || '');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tripTitle, setTripTitle] = useState('');
  const [tripDesc, setTripDesc] = useState('');
  const [durationDays, setDurationDays] = useState(2);

  // Active Trip
  const currentTrip = trips.find(t => t.id === activeTripId) || trips[0];

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripTitle.trim()) return;

    const newTrip = addTrip({
      title: tripTitle,
      description: tripDesc,
      governorate_ids: ['baghdad'],
      duration_days: durationDays,
      items: [
        { id: `item-init-${Date.now()}`, day: 1, time: '09:00', place_id: 'iraq-museum', duration_hours: 3, notes: 'بداية الرحلة' }
      ]
    });

    setActiveTripId(newTrip.id);
    setCreateModalOpen(false);
    setTripTitle('');
    setTripDesc('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="font-heritage text-3xl sm:text-4xl font-bold text-stone-900">
            {isAr ? 'مخطط الرحلات السياحية (Trip Planner)' : 'Iraq Trip Planner'}
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            {isAr
              ? 'صمم برنامج رحلتك المخصص، رتّب المعالم حسب الأيام والساعات، واحسب أوقات الزيارة.'
              : 'Create custom day-by-day itineraries, schedule visiting hours, and plan your route.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>{isAr ? 'طباعة البرنامج' : 'Print Plan'}</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إنشاء رحلة جديدة' : 'Create Trip'}</span>
          </button>
        </div>
      </div>

      {/* Trips Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
        {trips.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTripId(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-2 ${
              activeTripId === t.id
                ? 'bg-stone-900 text-amber-300 shadow-md'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.title}</span>
            {t.is_template && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-normal">
                {isAr ? 'مقترح' : 'Template'}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Trip Details & Day-by-Day Itinerary */}
      {currentTrip && (
        <div className="space-y-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
          
          {/* Trip Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <h2 className="font-heritage text-2xl font-bold text-stone-900">
                {currentTrip.title}
              </h2>
              {currentTrip.description && (
                <p className="text-stone-600 text-xs sm:text-sm mt-1">
                  {currentTrip.description}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-stone-500 mt-2 font-medium">
                <span>{currentTrip.duration_days} {isAr ? 'أيام' : 'days'}</span>
                <span>·</span>
                <span>{currentTrip.items.length} {isAr ? 'محطات سياحية' : 'stops'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('explore')}
                className="px-4 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة معالم للرحلة' : 'Add Places'}</span>
              </button>

              {!currentTrip.is_template && (
                <button
                  onClick={() => deleteTrip(currentTrip.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title={isAr ? 'حذف هذه الرحلة' : 'Delete Trip'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Days Timetable */}
          <div className="space-y-6">
            {Array.from({ length: currentTrip.duration_days }, (_, i) => i + 1).map(dayNumber => {
              const dayItems = currentTrip.items.filter(it => it.day === dayNumber);

              return (
                <div key={dayNumber} className="border border-stone-200 rounded-2xl p-5 bg-stone-50/50 space-y-4">
                  <div className="flex items-center justify-between font-bold text-stone-900 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs">
                        {dayNumber}
                      </span>
                      <span>{isAr ? `اليوم ${dayNumber}` : `Day ${dayNumber}`}</span>
                    </span>
                    <span className="text-xs text-stone-500">
                      {dayItems.length} {isAr ? 'محطات' : 'stops'}
                    </span>
                  </div>

                  {dayItems.length > 0 ? (
                    <div className="space-y-3">
                      {dayItems.map(item => {
                        const placeObj = places.find(p => p.id === item.place_id);
                        if (!placeObj) return null;

                        return (
                          <div
                            key={item.id}
                            className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={placeObj.cover_image}
                                alt=""
                                className="w-14 h-14 rounded-xl object-cover shrink-0 cursor-pointer"
                                onClick={() => setActiveView('place-detail', placeObj.id)}
                              />
                              <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>{item.time}</span>
                                  <span>·</span>
                                  <span 
                                    onClick={() => setActiveView('place-detail', placeObj.id)}
                                    className="hover:text-amber-700 cursor-pointer text-sm"
                                  >
                                    {isAr ? placeObj.name_ar : placeObj.name_en}
                                  </span>
                                </div>
                                <div className="text-[11px] text-stone-500 mt-1">
                                  {isAr ? placeObj.city_ar : placeObj.city_en} · {isAr ? placeObj.opening_hours_ar : placeObj.opening_hours_en}
                                </div>
                                {item.notes && (
                                  <div className="text-[11px] text-amber-800 font-medium mt-1">
                                    💡 {item.notes}
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => setActiveView('place-detail', placeObj.id)}
                              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg self-end sm:self-center transition"
                            >
                              {isAr ? 'تفاصيل المعلم ←' : 'Details →'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-stone-400 bg-white rounded-xl border border-dashed border-stone-200">
                      {isAr ? 'لم يتم إضافة محطات لهذا اليوم بعد. تصفح المعالم واضغط "أضف للرحلة".' : 'No places scheduled for this day yet.'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Trip Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-bold text-stone-900 text-base">
              {isAr ? 'إنشاء خطة رحلة جديدة' : 'Create New Trip'}
            </h3>

            <form onSubmit={handleCreateTrip} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'عنوان الرحلة *' : 'Trip Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={tripTitle}
                  onChange={e => setTripTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: رحلة آثار بابل وكربلاء' : 'e.g. Babylon & Karbala Heritage Tour'}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'عدد الأيام' : 'Duration (Days)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={durationDays}
                  onChange={e => setDurationDays(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'ملاحظات أو وصف' : 'Description / Notes'}
                </label>
                <textarea
                  rows={2}
                  value={tripDesc}
                  onChange={e => setTripDesc(e.target.value)}
                  placeholder={isAr ? 'وصف الرحلة وأهدافها...' : 'Trip goals...'}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
                >
                  {isAr ? 'إنشاء' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
