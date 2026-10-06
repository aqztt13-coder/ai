import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Place } from '../../types';

interface SuggestEditModalProps {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestEditModal: React.FC<SuggestEditModalProps> = ({ place, isOpen, onClose }) => {
  const { language, addEditSuggestion } = useApp();
  const isAr = language === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [suggestionType, setSuggestionType] = useState<'incorrect_hours' | 'wrong_location' | 'outdated_info' | 'closed_permanently' | 'other'>('outdated_info');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || !name.trim()) return;

    addEditSuggestion({
      place_id: place.id,
      place_name: isAr ? place.name_ar : place.name_en,
      user_name: name,
      user_email: email,
      suggestion_type: suggestionType,
      details
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-stone-900 text-base">
              {isAr ? 'اقتراح تعديل أو تصحيح معلومة' : 'Suggest an Edit / Correction'}
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
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-stone-900 text-base">
              {isAr ? 'شكراً لمساهمتك القيمة!' : 'Thank you for your feedback!'}
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {isAr
                ? 'تم استلام اقتراحك وسيقوم فريق التحرير بمراجعته والتحقق من المصادر وتحديث المعلم.'
                : 'Your suggestion has been submitted for editorial review and fact verification.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="text-xs text-stone-600 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
              <span className="font-bold text-amber-900">
                {isAr ? place.name_ar : place.name_en}
              </span>
              <p className="mt-0.5 text-stone-500">
                {isAr ? 'ساعدنا في الحفاظ على دقة دليل العراق السياحي.' : 'Help us keep the Iraq Tourism Guide accurate and up-to-date.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'اسمك الكريم *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={isAr ? 'مثال: علي البابلي' : 'e.g. Ali Al-Babili'}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isAr ? 'نوع التعديل المطلوب *' : 'Type of Correction *'}
              </label>
              <select
                value={suggestionType}
                onChange={e => setSuggestionType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 bg-white"
              >
                <option value="incorrect_hours">{isAr ? 'أوقات أو أيام الزيارة غير دقيقة' : 'Incorrect Opening Hours'}</option>
                <option value="wrong_location">{isAr ? 'الموقع الجغرافي أو الخريطة بحاجة لتعديل' : 'GPS Location / Map Error'}</option>
                <option value="outdated_info">{isAr ? 'معلومات التذاكر أو الرسوم تغيرت' : 'Outdated Ticket Prices / Info'}</option>
                <option value="closed_permanently">{isAr ? 'المكان مغلق مؤقتاً أو دائماً' : 'Place is Closed'}</option>
                <option value="other">{isAr ? 'أخرى (معلومة تاريخية أو وصف)' : 'Other (Historical detail or description)'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isAr ? 'تفاصيل التعديل والمصدر إن وجد *' : 'Correction Details & Source *'}
              </label>
              <textarea
                required
                rows={4}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder={isAr ? 'اذكر التفاصيل الصحيحة أو الرابط الموثق للتعديل...' : 'Describe the correct details or reference link...'}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition shadow-sm"
              >
                {isAr ? 'إرسال الاقتراح للمراجعة' : 'Submit for Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
