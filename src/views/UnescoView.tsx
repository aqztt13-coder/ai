import React from 'react';
import { useApp } from '../context/AppContext';
import { PlaceCard } from '../components/places/PlaceCard';
import { Award, Globe2, Sparkles, BookOpen } from 'lucide-react';

export const UnescoView: React.FC = () => {
  const { language, places } = useApp();
  const isAr = language === 'ar';

  const unescoPlaces = places.filter(p => p.unesco && p.status === 'published');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 rounded-3xl p-8 sm:p-12 text-white border border-amber-900/50 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
          <Award className="w-4 h-4" />
          <span>{isAr ? 'منظمة اليونسكو العالمية' : 'UNESCO World Heritage'}</span>
        </div>
        <h1 className="font-heritage text-3xl sm:text-5xl font-extrabold text-amber-100">
          {isAr ? 'مواقع العراق ذات القيمة الإنسانية العالمية' : 'Iraq World Heritage Inscribed Sites'}
        </h1>
        <p className="text-stone-300 text-xs sm:text-base max-w-3xl leading-relaxed">
          {isAr
            ? 'تعد جمهورية العراق مهداً لواحدة من أقدم الحضارات وأعظمها. تدرج منظمة الأمم المتحدة للتربية والعلم والثقافة (اليونسكو) ستة مواقع استثنائية في العراق تجسد فجر التدوين والعمارة والأنظمة البيئية الفريدة.'
            : 'Iraq boasts exceptional cultural and natural sanctuaries recognized by UNESCO for their outstanding universal value to human civilization.'}
        </p>
      </div>

      {/* Grid of UNESCO Sites */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {unescoPlaces.map(place => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
};
