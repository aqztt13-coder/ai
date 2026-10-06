import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Sun, 
  CreditCard, 
  Car, 
  Phone, 
  HeartHandshake, 
  FileText,
  MapPin,
  Clock
} from 'lucide-react';

export const TravelGuideView: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'ar';

  const guideSections = [
    {
      icon: FileText,
      title_ar: 'تأشيرة الدخول ومتطلبات السفر',
      title_en: 'Visa Requirements & Entry',
      content_ar: 'تمنح جمهورية العراق تأشيرة دخول فورية عند الوصول (Visa on Arrival) في المطارات الدولية لمواطني أكثر من 37 دولة (الاتحاد الأوروبي، بريطانيا، الولايات المتحدة، كندا، الصين وغيرها)، بالإضافة إلى بوابة التأشيرة الإلكترونية الرسمية (evisa.iq). تأكد من صلاحية جواز السفر لمدة لا تقل عن 6 أشهر.',
      content_en: 'Iraq offers Visa on Arrival at international airports for citizens of 37+ nations, plus the official eVisa portal (evisa.iq). Ensure passport validity for at least 6 months.'
    },
    {
      icon: Sun,
      title_ar: 'أفضل أوقات الزيارة والمناخ',
      title_en: 'Best Season & Climate',
      content_ar: 'أفضل فترة لزيارة وسط وجنوب العراق (بغداد، بابل، النجف، كربلاء، الأهوار، البصرة) هي من شهر أكتوبر إلى نهاية شهر أبريل حيث تكون الأجواء معتدلة ومثالية. أما محافظات إقليم كوردستان وجبالها فيفضل زيارتها في الربيع (مارس – مايو) والصيف لاعتدال الطقس ووجود الشلالات والمصايف.',
      content_en: 'The optimal window for Central and Southern Iraq (Baghdad, Babylon, Karbala, Najaf, Marshes, Basra) is October to April. Northern Kurdistan mountains are ideal in spring and summer.'
    },
    {
      icon: HeartHandshake,
      title_ar: 'قواعد وآداب زيارة الأماكن الدينية والمراقد',
      title_en: 'Etiquette for Holy Shrines',
      content_ar: 'تتميز المراقد الدينية في النجف وكربلاء وبغداد وسامراء بقدسية فائقة. يطلب من الزوار ارتداء ملابس محتشمة ومحترمة (العباءة والزي الساتر للنساء، والملابس الطويلة المحتشمة للرجال). تتوفر العباءات واللباس المخصص مجاناً عند مداخل العتبات. يمنع إدخال الكاميرات الاحترافية في بعض الأماكن دون تصريح إعلامي مسبق.',
      content_en: 'Holy shrines require modest, respectful attire (abayas provided at entrances for women; long pants/sleeves for men). Photography inside central tomb chambers may require media permission.'
    },
    {
      icon: CreditCard,
      title_ar: 'العملة وطرق الدفع والإنفاق',
      title_en: 'Currency & Payments',
      content_ar: 'العملة الرسمية هي الدينار العراقي (IQD). تتراوح أسعار الصرف التقريبية حول 1,310 - 1,480 دينار للدولار الأمريكي. النقد هو الوسيلة الأكثر شيوعاً في الأسواق الشعبية والمطاعم، بينما تقبل الفنادق الكبرى والمراكز الحديثة بطاقات Visa وMasterCard.',
      content_en: 'Official currency is Iraqi Dinar (IQD). Cash is customary in local bazaars and traditional dining, while luxury hotels and malls accept major credit cards.'
    },
    {
      icon: Car,
      title_ar: 'المواصلات والتنقل الداخلي',
      title_en: 'Transportation & Getting Around',
      content_ar: 'تتوفر تطبيقات التاكسي الذكية مثل (كريم Careem، بلي Baly) في بغداد وأربيل والبصرة. للتنقل بين المحافظات، تتوفر رحلات القطار الحديثة بين بغداد والبصرة، والرحلات الجوية الداخلية عبر الخطوط الجوية العراقية وفلاي بغداد، وسيارات الأجرة السريعة بين المدن.',
      content_en: 'Ride-hailing apps (Careem, Baly) operate reliably in major cities. Intercity travel includes the modernized Baghdad-Basra railway, domestic flights, and shared regional taxis.'
    },
    {
      icon: Phone,
      title_ar: 'أرقام الطوارئ والمساعدة السياحية',
      title_en: 'Emergency & Tourist Numbers',
      content_ar: 'شرطة النجدة: 104 | الإسعاف الفوري: 122 | الدفاع المدني: 115 | الاستعلامات السياحية: 160 | أمن الموانئ والمطارات: 106. الشعب العراقي مشهور بكرم الضيافة الفائق وإعانة الزائرين بكل محبة وود.',
      content_en: 'Police: 104 | Ambulance: 122 | Fire Service: 115 | Tourist Assistance: 160. Iraqi hospitality is renowned worldwide for treating visitors like honored family.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-4">
      <div className="border-b border-stone-200 pb-6">
        <h1 className="font-heritage text-3xl sm:text-4xl font-bold text-stone-900">
          {isAr ? 'دليل السفر إلى جمهورية العراق' : 'Traveler Practical Guide to Iraq'}
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-1">
          {isAr
            ? 'كل ما يحتاجه السائح من معلومات قبل السفر: التأشيرة، المواصلات، العملة، وآداب الزيارة.'
            : 'Essential information before your trip: entry visas, transport, currency, etiquette, and safety.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {guideSections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heritage text-xl font-bold text-stone-900">
                  {isAr ? sec.title_ar : sec.title_en}
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {isAr ? sec.content_ar : sec.content_en}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
