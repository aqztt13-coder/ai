import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Phone, Mail, MapPin, CheckCircle2, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, governorates, categories, setActiveView } = useApp();
  const isAr = language === 'ar';

  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-amber-950/60 pt-16 pb-24 lg:pb-16 mt-20 relative overflow-hidden">
      {/* Decorative subtle Mesopotamian water wave pattern */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 shadow-md">
                <Sparkles className="w-6 h-6 text-stone-950" />
              </div>
              <span className="font-heritage text-2xl font-bold text-amber-200">
                {isAr ? 'دليل العراق السياحي' : 'Iraq Tourism Guide'}
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-md">
              {isAr
                ? 'المنصة الرقمية المتكاملة لتوثيق واكتشاف كنوز جمهورية العراق التاريخية والأثرية والطبيعية والدينية. نافذتك الموثقة لزيارة مهد الحضارات الإنسانية وبلاد الرافدين.'
                : 'The comprehensive digital platform to document and explore the cultural, archaeological, and natural wonders of the Republic of Iraq, cradle of world civilizations.'}
            </p>
            
            {/* Emergency & Tourist Info */}
            <div className="p-3.5 rounded-xl bg-stone-900 border border-amber-900/40 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Shield className="w-4 h-4" />
                <span>{isAr ? 'أرقام الطوارئ والمعلومات السياحية' : 'Emergency & Tourist Numbers'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-stone-300">
                <div>{isAr ? 'شرطة النجدة: 104' : 'Police: 104'}</div>
                <div>{isAr ? 'الإسعاف الفوري: 122' : 'Ambulance: 122'}</div>
                <div>{isAr ? 'الدفاع المدني: 115' : 'Fire & Rescue: 115'}</div>
                <div>{isAr ? 'الاستعلامات السياحية: 160' : 'Tourist Info: 160'}</div>
              </div>
            </div>
          </div>

          {/* Governorates quick links */}
          <div className="space-y-3">
            <h4 className="text-amber-300 font-bold text-sm tracking-wide">
              {isAr ? 'محافظات العراق' : 'Governorates'}
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-stone-400">
              {governorates.slice(0, 10).map(gov => (
                <button
                  key={gov.id}
                  onClick={() => setActiveView('governorate-detail', gov.id)}
                  className="text-right hover:text-amber-400 transition truncate text-left"
                >
                  {isAr ? gov.name_ar : gov.name_en}
                </button>
              ))}
              <button
                onClick={() => setActiveView('governorates')}
                className="text-amber-400 hover:underline col-span-2 text-left pt-1 font-medium"
              >
                {isAr ? 'عرض جميع المحافظات (18) ←' : 'View all 18 governorates →'}
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-amber-300 font-bold text-sm tracking-wide">
              {isAr ? 'التصنيفات السياحية' : 'Categories'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => setActiveView('explore')}
                    className="hover:text-amber-400 transition"
                  >
                    {isAr ? cat.name_ar : cat.name_en}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setActiveView('unesco')}
                  className="hover:text-amber-400 transition text-amber-300 font-semibold"
                >
                  {isAr ? 'مواقع اليونسكو للتراث العالمي' : 'UNESCO World Heritage Sites'}
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-3">
            <h4 className="text-amber-300 font-bold text-sm tracking-wide">
              {isAr ? 'النشرة السياحية' : 'Newsletter'}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              {isAr
                ? 'اشترك للحصول على توصيات الوجهات الجديدة، فعاليات المهرجانات، وبرامج الرحلات الموسمية.'
                : 'Subscribe to receive curated itineraries, upcoming seasonal festivals, and heritage updates.'}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder={isAr ? 'بريدك الإلكتروني...' : 'Your email address...'}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs rounded-lg transition"
              >
                {isAr ? 'اشتراك في النشرة' : 'Subscribe'}
              </button>
            </form>
            {subscribed && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'شكراً لاشتراكك في دليل العراق السياحي!' : 'Thank you for subscribing!'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 {isAr ? 'دليل العراق السياحي. جميع الحقوق محفوظة.' : 'Iraq Tourism Guide. All rights reserved.'}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveView('guide')} className="hover:text-amber-400 transition">
              {isAr ? 'دليل الزائر' : 'Travel Guide'}
            </button>
            <span className="text-stone-700">·</span>
            <button onClick={() => setActiveView('trips')} className="hover:text-amber-400 transition">
              {isAr ? 'مخطط الرحلات' : 'Trip Planner'}
            </button>
            <span className="text-stone-700">·</span>
            <button onClick={() => setActiveView('map')} className="hover:text-amber-400 transition">
              {isAr ? 'الخريطة' : 'Map'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
